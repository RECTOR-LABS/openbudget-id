/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/openbudget.json`.
 */
export type Openbudget = {
  "address": "RECtBgp43nvj5inPVW7qo1YN95RwXaYDxLX4dvuJXFY",
  "metadata": {
    "name": "openbudget",
    "version": "0.1.0",
    "spec": "0.1.0",
    "description": "Created with Anchor"
  },
  "instructions": [
    {
      "name": "addMilestone",
      "discriminator": [
        165,
        18,
        177,
        128,
        204,
        172,
        23,
        249
      ],
      "accounts": [
        {
          "name": "milestone",
          "writable": true
        },
        {
          "name": "project",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  114,
                  111,
                  106,
                  101,
                  99,
                  116
                ]
              },
              {
                "kind": "arg",
                "path": "projectId"
              }
            ]
          }
        },
        {
          "name": "authority",
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "projectId",
          "type": "string"
        },
        {
          "name": "index",
          "type": "u8"
        },
        {
          "name": "description",
          "type": "string"
        },
        {
          "name": "amount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "initializePlatform",
      "discriminator": [
        119,
        201,
        101,
        45,
        75,
        122,
        89,
        3
      ],
      "accounts": [
        {
          "name": "platformState",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  108,
                  97,
                  116,
                  102,
                  111,
                  114,
                  109
                ]
              }
            ]
          }
        },
        {
          "name": "admin",
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": []
    },
    {
      "name": "initializeProject",
      "discriminator": [
        69,
        126,
        215,
        37,
        20,
        60,
        73,
        235
      ],
      "accounts": [
        {
          "name": "project",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  114,
                  111,
                  106,
                  101,
                  99,
                  116
                ]
              },
              {
                "kind": "arg",
                "path": "projectId"
              }
            ]
          }
        },
        {
          "name": "platformState",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  108,
                  97,
                  116,
                  102,
                  111,
                  114,
                  109
                ]
              }
            ]
          }
        },
        {
          "name": "authority",
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "projectId",
          "type": "string"
        },
        {
          "name": "title",
          "type": "string"
        },
        {
          "name": "ministry",
          "type": "string"
        },
        {
          "name": "totalBudget",
          "type": "u64"
        }
      ]
    },
    {
      "name": "releaseFunds",
      "discriminator": [
        225,
        88,
        91,
        108,
        126,
        52,
        2,
        26
      ],
      "accounts": [
        {
          "name": "milestone",
          "writable": true
        },
        {
          "name": "project",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  114,
                  111,
                  106,
                  101,
                  99,
                  116
                ]
              },
              {
                "kind": "arg",
                "path": "projectId"
              }
            ]
          }
        },
        {
          "name": "authority",
          "signer": true
        }
      ],
      "args": [
        {
          "name": "projectId",
          "type": "string"
        },
        {
          "name": "index",
          "type": "u8"
        },
        {
          "name": "proofUrl",
          "type": "string"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "milestone",
      "discriminator": [
        38,
        210,
        239,
        177,
        85,
        184,
        10,
        44
      ]
    },
    {
      "name": "platformState",
      "discriminator": [
        160,
        10,
        182,
        134,
        98,
        122,
        78,
        239
      ]
    },
    {
      "name": "project",
      "discriminator": [
        205,
        168,
        189,
        202,
        181,
        247,
        142,
        19
      ]
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "projectIdTooLong",
      "msg": "Project ID must be 32 characters or less"
    },
    {
      "code": 6001,
      "name": "invalidTitle",
      "msg": "Title must be between 1 and 100 characters"
    },
    {
      "code": 6002,
      "name": "invalidBudget",
      "msg": "Budget must be greater than 0"
    },
    {
      "code": 6003,
      "name": "insufficientBudget",
      "msg": "Milestone amount exceeds remaining budget"
    },
    {
      "code": 6004,
      "name": "unauthorizedAccess",
      "msg": "Only project authority can perform this action"
    },
    {
      "code": 6005,
      "name": "milestoneAlreadyReleased",
      "msg": "Milestone already released"
    }
  ],
  "types": [
    {
      "name": "milestone",
      "docs": [
        "Milestone account - represents a spending milestone within a project",
        "PDA seed: [b\"milestone\", project_id.as_bytes(), &[index]]"
      ],
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "projectId",
            "type": "string"
          },
          {
            "name": "index",
            "type": "u8"
          },
          {
            "name": "description",
            "type": "string"
          },
          {
            "name": "amount",
            "type": "u64"
          },
          {
            "name": "isReleased",
            "type": "bool"
          },
          {
            "name": "releasedAt",
            "type": {
              "option": "i64"
            }
          },
          {
            "name": "proofUrl",
            "type": "string"
          }
        ]
      }
    },
    {
      "name": "platformState",
      "docs": [
        "Global platform state - manages admin and project counter",
        "PDA seed: [b\"platform\"]"
      ],
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "admin",
            "type": "pubkey"
          },
          {
            "name": "projectCount",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "project",
      "docs": [
        "Project account - represents a government spending project",
        "PDA seed: [b\"project\", project_id.as_bytes()]"
      ],
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "id",
            "type": "string"
          },
          {
            "name": "title",
            "type": "string"
          },
          {
            "name": "ministry",
            "type": "string"
          },
          {
            "name": "totalBudget",
            "type": "u64"
          },
          {
            "name": "totalAllocated",
            "type": "u64"
          },
          {
            "name": "totalReleased",
            "type": "u64"
          },
          {
            "name": "milestoneCount",
            "type": "u8"
          },
          {
            "name": "createdAt",
            "type": "i64"
          },
          {
            "name": "authority",
            "type": "pubkey"
          }
        ]
      }
    }
  ]
};

export const IDL = {
  "address": "RECtBgp43nvj5inPVW7qo1YN95RwXaYDxLX4dvuJXFY",
  "metadata": {
    "name": "openbudget",
    "version": "0.1.0",
    "spec": "0.1.0",
    "description": "Created with Anchor"
  },
  "instructions": [
    {
      "name": "addMilestone",
      "discriminator": [165, 18, 177, 128, 204, 172, 23, 249],
      "accounts": [
        { "name": "milestone", "writable": true },
        {
          "name": "project",
          "writable": true,
          "pda": {
            "seeds": [
              { "kind": "const", "value": [112, 114, 111, 106, 101, 99, 116] },
              { "kind": "arg", "path": "projectId" }
            ]
          }
        },
        { "name": "authority", "writable": true, "signer": true },
        { "name": "systemProgram", "address": "11111111111111111111111111111111" }
      ],
      "args": [
        { "name": "index", "type": "u8" },
        { "name": "description", "type": "string" },
        { "name": "amount", "type": "u64" }
      ]
    },
    {
      "name": "initializePlatform",
      "discriminator": [24, 221, 220, 190, 69, 217, 109, 184],
      "accounts": [
        { "name": "platform", "writable": true, "pda": { "seeds": [{ "kind": "const", "value": [112, 108, 97, 116, 102, 111, 114, 109] }] } },
        { "name": "admin", "writable": true, "signer": true },
        { "name": "systemProgram", "address": "11111111111111111111111111111111" }
      ],
      "args": []
    },
    {
      "name": "initializeProject",
      "discriminator": [155, 255, 218, 243, 167, 219, 180, 131],
      "accounts": [
        { "name": "project", "writable": true },
        {
          "name": "platform",
          "writable": true,
          "pda": { "seeds": [{ "kind": "const", "value": [112, 108, 97, 116, 102, 111, 114, 109] }] }
        },
        { "name": "authority", "writable": true, "signer": true },
        { "name": "systemProgram", "address": "11111111111111111111111111111111" }
      ],
      "args": [
        { "name": "projectId", "type": "string" },
        { "name": "title", "type": "string" },
        { "name": "ministry", "type": "string" },
        { "name": "totalBudget", "type": "u64" }
      ]
    },
    {
      "name": "releaseFunds",
      "discriminator": [132, 207, 33, 255, 39, 230, 30, 176],
      "accounts": [
        { "name": "milestone", "writable": true },
        {
          "name": "project",
          "writable": true,
          "pda": {
            "seeds": [
              { "kind": "const", "value": [112, 114, 111, 106, 101, 99, 116] },
              { "kind": "arg", "path": "projectId" }
            ]
          }
        },
        { "name": "authority", "signer": true }
      ],
      "args": [
        { "name": "index", "type": "u8" },
        { "name": "proofUrl", "type": "string" }
      ]
    }
  ],
  "accounts": [
    {
      "name": "milestone",
      "discriminator": [121, 87, 27, 23, 129, 155, 140, 72]
    },
    {
      "name": "platformState",
      "discriminator": [17, 66, 44, 148, 105, 250, 98, 29]
    },
    {
      "name": "project",
      "discriminator": [205, 222, 112, 7, 165, 155, 206, 218]
    }
  ],
  "types": [
    {
      "name": "milestone",
      "type": {
        "kind": "struct",
        "fields": [
          { "name": "projectId", "type": "string" },
          { "name": "index", "type": "u8" },
          { "name": "description", "type": "string" },
          { "name": "amount", "type": "u64" },
          { "name": "isReleased", "type": "bool" },
          { "name": "releasedAt", "type": { "option": "i64" } },
          { "name": "proofUrl", "type": "string" }
        ]
      }
    },
    {
      "name": "platformState",
      "type": {
        "kind": "struct",
        "fields": [
          { "name": "admin", "type": "pubkey" },
          { "name": "projectCount", "type": "u64" }
        ]
      }
    },
    {
      "name": "project",
      "type": {
        "kind": "struct",
        "fields": [
          { "name": "id", "type": "string" },
          { "name": "title", "type": "string" },
          { "name": "ministry", "type": "string" },
          { "name": "totalBudget", "type": "u64" },
          { "name": "totalAllocated", "type": "u64" },
          { "name": "totalReleased", "type": "u64" },
          { "name": "milestoneCount", "type": "u8" },
          { "name": "createdAt", "type": "i64" },
          { "name": "authority", "type": "pubkey" }
        ]
      }
    }
  ]
};

export default IDL as any;
