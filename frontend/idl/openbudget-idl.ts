export type Openbudget = {
  "version": "0.1.0",
  "name": "openbudget",
  "instructions": [
    {
      "name": "addMilestone",
      "accounts": [
        {
          "name": "milestone",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "project",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "authority",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
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
      "accounts": [
        {
          "name": "platformState",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "admin",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "initializeProject",
      "accounts": [
        {
          "name": "project",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "platformState",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "authority",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
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
      "accounts": [
        {
          "name": "milestone",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "project",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "authority",
          "isMut": false,
          "isSigner": true
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
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "admin",
            "type": "publicKey"
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
            "type": "publicKey"
          }
        ]
      }
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "ProjectIdTooLong",
      "msg": "Project ID must be 32 characters or less"
    },
    {
      "code": 6001,
      "name": "InvalidTitle",
      "msg": "Title must be between 1 and 100 characters"
    },
    {
      "code": 6002,
      "name": "InvalidBudget",
      "msg": "Budget must be greater than 0"
    },
    {
      "code": 6003,
      "name": "InsufficientBudget",
      "msg": "Milestone amount exceeds remaining budget"
    },
    {
      "code": 6004,
      "name": "UnauthorizedAccess",
      "msg": "Only project authority can perform this action"
    },
    {
      "code": 6005,
      "name": "MilestoneAlreadyReleased",
      "msg": "Milestone already released"
    }
  ]
};

export const IDL: Openbudget = {
  "version": "0.1.0",
  "name": "openbudget",
  "instructions": [
    {
      "name": "addMilestone",
      "accounts": [
        {
          "name": "milestone",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "project",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "authority",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
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
      "accounts": [
        {
          "name": "platformState",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "admin",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "initializeProject",
      "accounts": [
        {
          "name": "project",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "platformState",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "authority",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
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
      "accounts": [
        {
          "name": "milestone",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "project",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "authority",
          "isMut": false,
          "isSigner": true
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
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "admin",
            "type": "publicKey"
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
            "type": "publicKey"
          }
        ]
      }
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "ProjectIdTooLong",
      "msg": "Project ID must be 32 characters or less"
    },
    {
      "code": 6001,
      "name": "InvalidTitle",
      "msg": "Title must be between 1 and 100 characters"
    },
    {
      "code": 6002,
      "name": "InvalidBudget",
      "msg": "Budget must be greater than 0"
    },
    {
      "code": 6003,
      "name": "InsufficientBudget",
      "msg": "Milestone amount exceeds remaining budget"
    },
    {
      "code": 6004,
      "name": "UnauthorizedAccess",
      "msg": "Only project authority can perform this action"
    },
    {
      "code": 6005,
      "name": "MilestoneAlreadyReleased",
      "msg": "Milestone already released"
    }
  ]
};
