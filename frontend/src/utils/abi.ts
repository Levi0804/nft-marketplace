export const ABI={
    "address": "0x0d8e036d15b11ff270283fb9bd6c5c620d98fd6a871b1494546425cc064b1d34",
    "name": "main",
    "friends": [],
    "exposed_functions": [
      {
        "name": "create_pokemon",
        "visibility": "private",
        "is_entry": true,
        "is_view": false,
        "generic_type_params": [],
        "params": [
          "&signer",
          "0x1::string::String",
          "0x1::string::String"
        ],
        "return": []
      },
      {
        "name": "get_pokemon",
        "visibility": "public",
        "is_entry": false,
        "is_view": true,
        "generic_type_params": [],
        "params": [
          "0x1::object::Object<0x4::token::Token>"
        ],
        "return": [
          "0x1::string::String",
          "0x433e88086524c15a79c96a8841ad1fb5e1d6917a7ca748adb138c3b776257989::main::PokemonData"
        ]
      },
      {
        "name": "get_pokemon_collection_address",
        "visibility": "public",
        "is_entry": false,
        "is_view": true,
        "generic_type_params": [],
        "params": [],
        "return": [
          "address"
        ]
      },
      {
        "name": "get_pokemon_collection_creator_address",
        "visibility": "public",
        "is_entry": false,
        "is_view": true,
        "generic_type_params": [],
        "params": [],
        "return": [
          "address"
        ]
      },
      {
        "name": "get_pokemon_collection_name",
        "visibility": "public",
        "is_entry": false,
        "is_view": true,
        "generic_type_params": [],
        "params": [],
        "return": [
          "0x1::string::String"
        ]
      }
    ],
    "structs": [
      {
        "name": "CollectionCapability",
        "is_native": false,
        "is_event": false,
        "abilities": [
          "key"
        ],
        "generic_type_params": [],
        "fields": [
          {
            "name": "extend_ref",
            "type": "0x1::object::ExtendRef"
          }
        ]
      },
      {
        "name": "MintPokemonEvent",
        "is_native": false,
        "is_event": true,
        "abilities": [
          "drop",
          "store"
        ],
        "generic_type_params": [],
        "fields": [
          {
            "name": "pokemon_address",
            "type": "address"
          },
          {
            "name": "token_name",
            "type": "0x1::string::String"
          }
        ]
      },
      {
        "name": "Pokemon",
        "is_native": false,
        "is_event": false,
        "abilities": [
          "drop",
          "key"
        ],
        "generic_type_params": [],
        "fields": [
          {
            "name": "data",
            "type": "0x433e88086524c15a79c96a8841ad1fb5e1d6917a7ca748adb138c3b776257989::main::PokemonData"
          },
          {
            "name": "extend_ref",
            "type": "0x1::object::ExtendRef"
          },
          {
            "name": "mutator_ref",
            "type": "0x4::token::MutatorRef"
          },
          {
            "name": "burn_ref",
            "type": "0x4::token::BurnRef"
          }
        ]
      },
      {
        "name": "PokemonData",
        "is_native": false,
        "is_event": false,
        "abilities": [
          "copy",
          "drop",
          "store",
          "key"
        ],
        "generic_type_params": [],
        "fields": [
          {
            "name": "uri",
            "type": "0x1::string::String"
          }
        ]
      }
    ]
  }