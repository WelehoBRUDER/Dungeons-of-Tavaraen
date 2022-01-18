/// IF THIS FILE GETS TOO LARGE, MAKE NEW ONES!! ///

// Stores all the interactions for characters in game //

/*

  Interaction types

  always - these interactions are available no matter what.
  conditional - more complex interactions that have conditions for display.
  dialogChoices - these come after always or conditional choices, advancing or ending dialog.

  actions
  "store", requires id of store, opens merchant screen.
  "dialog", requires id of dialog, advances to new dialog.
  "quest", requires id of quest, adds quest to journal.
  "exit", ends dialog.

  flags - set or modify flags after executing interaction.
*/
const characterInteractions = {
  testMerchant: {
    always: [
      {
        name: "testMerchant_store",
        type: "openStore",
        action: { type: "store", id: "testMerchant_store_normal" }
      },
      {
        name: "leaveDialog",
        type: "exit",
        action: {type: "exit"},
        displayAtBottom: true,
      }
    ],
    conditional: [
      {
        name: "testMerchant_business",
        type: "quest",
        action: { type: "dialog", id: "testMerchant_business_dialog_1" },
        conditions: [
          {
            NOT_has_flag: "has_spoken_to_merchant"
          }
        ],
        flags: [
          {
            set_flag: {
              flag: "has_spoken_to_merchant",
              value: true
            }
          }
        ],
      },
      {
        name: "testMerchant_defeated_the_slimes",
        type: "quest",
        action: { type: "questObjective", id: "completed_slime_quest", questId: "defeat_slimes_task" },
        conditions: [
          {
            has_flag: "defeated_robber_slimes_talk",
            NOT_has_flag: "completed_quest_defeat_slimes"
          }
        ],
      },
    ],
    dialogChoices: [
      {
        name: "testMerchant_agree_to_quest",
        type: "quest",
        action: { type: "quest", id: "accept_slime_quest", questId: "defeat_slimes_task" },
        parent: "testMerchant_talk_about_business",
        conditions: [
          {
            has_flag: "has_spoken_to_merchant",
            NOT_has_flag: "accepted_merchant_quest_1"
          }
        ],
        flags: [
          {
            set_flag: {
              flag: "accepted_merchant_quest_1",
              value: true
            }
          }
        ],
      },
      {
        name: "testMerchant_decline_quest",
        type: "exit",
        action: { type: "exitWithFlags" },
        parent: "testMerchant_talk_about_business",
        conditions: [
          {
            has_flag: "has_spoken_to_merchant",
            NOT_has_flag: "accepted_merchant_quest_1"
          }
        ],
        flags: [
          {
            set_flag: {
              flag: "has_spoken_to_merchant",
              value: false
            }
          }
        ]
      }
    ],
  }
} as any;