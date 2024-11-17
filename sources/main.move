module pokemon::main { 
    use aptos_framework::event;
    use aptos_framework::object::{Self, ExtendRef, Object};
    use aptos_token_objects::collection;
    use aptos_token_objects::token::{Token, Self};
    use std::option;
    use std::signer::address_of;
    use std::string::{String, utf8};

    /// Pokemon not exist at given address
    const EPOKEMON_NOT_EXIST: u64 = 1;

    const APP_OBJECT_SEED: vector<u8> = b"POKEMON";
    const POKEMON_COLLECTION_NAME: vector<u8> = b"Pokemon Collection";
    const POKEMON_COLLECTION_DESCRIPTION: vector<u8> = b"This is a collection of pokemon nfts";

    struct PokemonData has copy, drop, key, store {
        uri: String, // link to json containting metadata such as image link etc.
    }

    struct Pokemon has key {
        data: PokemonData,
        extend_ref: ExtendRef,
        mutator_ref: token::MutatorRef,
        burn_ref: token::BurnRef,
    }

    #[event]
    struct MintPokemonEvent has drop, store {
        pokemon_address: address,
        token_name: String,
    }

     struct CollectionCapability has key {
        extend_ref: ExtendRef,
    }

    // This function is only called once when the module is published for the first time.
    fun init_module(account: &signer) {
        let constructor_ref = object::create_named_object(
            account,
            APP_OBJECT_SEED,
        );
        let extend_ref = object::generate_extend_ref(&constructor_ref);
        let app_signer = &object::generate_signer(&constructor_ref);

        move_to(app_signer, CollectionCapability {
            extend_ref,
        });

        create_pokemon_collection(app_signer);
    }

    fun get_collection_address(): address {
        object::create_object_address(&@pokemon, APP_OBJECT_SEED)
    }

    fun get_collection_signer(collection_address: address): signer acquires CollectionCapability {
        object::generate_signer_for_extending(&borrow_global<CollectionCapability>(collection_address).extend_ref)
    }

    fun get_pokemon_signer(pokemon_address: address): signer acquires Pokemon {
        object::generate_signer_for_extending(&borrow_global<Pokemon>(pokemon_address).extend_ref)
    }

    fun create_pokemon_collection(creator: &signer) {
        let description = utf8(POKEMON_COLLECTION_DESCRIPTION);
        let name = utf8(POKEMON_COLLECTION_NAME);
        let uri = utf8(b"https://whatarethesewordsbardock/pokemon.png"); // represents the collection

        collection::create_unlimited_collection(
            creator,
            description,
            name,
            option::none(),
            uri,
        );
    }

    // Create an Pokemon token object.
    // Because this function calls random it must not be public.
    // This ensures user can only call it from a transaction instead of another contract.
    // This prevents users seeing the result of mint and act on it, e.g. see the result and abort the tx if they don't like it.
    entry fun create_pokemon(user: &signer, name: String, uri: String) acquires CollectionCapability {
        let description = utf8(POKEMON_COLLECTION_DESCRIPTION);
        let data = PokemonData {
            uri,
        };

        let collection_address = get_collection_address();
        let constructor_ref = &token::create(
            &get_collection_signer(collection_address),
            utf8(POKEMON_COLLECTION_NAME),
            description,
            name,
            option::none(),
            uri,
        );

        let token_signer_ref = &object::generate_signer(constructor_ref);

        let extend_ref = object::generate_extend_ref(constructor_ref);
        let mutator_ref = token::generate_mutator_ref(constructor_ref);
        let burn_ref = token::generate_burn_ref(constructor_ref);
        let transfer_ref = object::generate_transfer_ref(constructor_ref);

        // Initialize and set default Pokemon struct values
        let pokemon = Pokemon {
            data,
            extend_ref,
            mutator_ref,
            burn_ref,
        };
        move_to(token_signer_ref, pokemon);

        // Emit event for minting Pokemon token
        event::emit(
            MintPokemonEvent {
                pokemon_address: address_of(token_signer_ref),
                token_name: name,
            },
        );

        // Transfer the Pokemon to the user
        object::transfer_with_ref(object::generate_linear_transfer_ref(&transfer_ref), address_of(user));
    }

    // Purchase outright an item from a fixed price listing.
    // Purchase function to be implmented 
    // this is the function signature
    // public entry fun purchase<CoinType>(
    //     purchaser: &signer,
    //     object: object::Object<object::ObjectCore>,
    // ) acquires FixedPriceListing, Listing, SellerListings, Sellers {
        
    // }


    // Get collection name of pokemon collection
    #[view]
    public fun get_pokemon_collection_name(): (String) {
        utf8(POKEMON_COLLECTION_NAME)
    }

    // Get creator address of pokemon collection
    #[view]
    public fun get_pokemon_collection_creator_address(): (address) {
        get_collection_address()
    }

    // Get collection ID of pokemon collection
    #[view]
    public fun get_pokemon_collection_address(): (address) {
        let collection_name = utf8(POKEMON_COLLECTION_NAME);
        let creator_address = get_collection_address();
        collection::create_collection_address(&creator_address, &collection_name)
    }

    // Returns all fields for this Pokemon (if found)
    #[view]
    public fun get_pokemon(pokemon_obj: Object<Token>): (String, PokemonData) acquires Pokemon {
        let pokemon_address = object::object_address(&pokemon_obj);
        assert!(object::object_exists<Token>(pokemon_address), EPOKEMON_NOT_EXIST);
        let pokemon = borrow_global<Pokemon>(pokemon_address);
        (token::name<Token>(pokemon_obj), pokemon.data)
    }

    // #[test_only]
    // use std::debug;
    // #[test_only]
    // use std::signer;
    // #[test_only]
    // const THIS_FAILS: u64 = 1;

    // // this test also fails
    // #[test(caller = @0x9000)]
    // #[expected_failure(abort_code = THIS_FAILS)]
    // fun test(caller: &signer)  acquires CollectionCapability {
    //     init_module(caller);

    //     let collection_address = get_collection_address();

    //     let description = utf8(POKEMON_COLLECTION_DESCRIPTION);
    //     let name = utf8(POKEMON_COLLECTION_NAME);
    //     let uri = utf8(b"https://whatarethesewordsbardock/pokemon.png"); 

    //     let constructor_ref = &token::create(
    //         &get_collection_signer(collection_address),
    //         utf8(POKEMON_COLLECTION_NAME),
    //         description,
    //         name,
    //         option::none(),
    //         uri,
    //     );  // ConstructorRef 

    //     let data = PokemonData {
    //         uri,
    //     };

    //     let extend_ref = object::generate_extend_ref(constructor_ref);
    //     let mutator_ref = token::generate_mutator_ref(constructor_ref);
    //     let burn_ref = token::generate_burn_ref(constructor_ref);
    //     let transfer_ref = object::generate_transfer_ref(constructor_ref);

    //     let pokemon = Pokemon {
    //         data,
    //         extend_ref,
    //         mutator_ref,
    //         burn_ref,
    //     };

    //     move_to(caller, pokemon);

    //     let object = object::object_from_constructor_ref<Token>(
    //         constructor_ref
    //     ); // Object<Token>

    //     debug::print(&object);

    //     // let (string, data) = get_pokemon(object);

    //     // object::transfer(caller, object, collection_address);

    // }
}

    