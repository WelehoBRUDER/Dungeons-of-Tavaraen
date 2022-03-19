"use strict";
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
                action: { type: "exit" },
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
            {
                name: "testMerchant_more_slime_trouble",
                type: "quest",
                action: { type: "dialog", id: "testMerchant_business_dialog_1" },
                conditions: [
                    {
                        has_flag: "completed_quest_defeat_slimes",
                        NOT_has_flag: "has_heard_merchant_troubles"
                    }
                ],
                flags: [
                    {
                        set_flag: {
                            flag: "has_heard_merchant_troubles",
                            value: true
                        }
                    }
                ],
            },
            {
                name: "testMerchant_defeated_the_slimes_2",
                type: "quest",
                action: { type: "questObjective", id: "completed_slime_quest_2", questId: "defeat_slimes_task_2" },
                conditions: [
                    {
                        has_flag: "exterminate_slimes_talk",
                        NOT_has_flag: "completed_quest_defeat_slimes_2"
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
            },
            {
                name: "testMerchant_agree_to_quest_2",
                type: "quest",
                action: { type: "quest", id: "accept_slime_quest_2", questId: "defeat_slimes_task_2" },
                parent: "testMerchant_more_slime_trouble",
                conditions: [
                    {
                        has_flag: "has_heard_merchant_troubles",
                        NOT_has_flag: "accepted_merchant_quest_2"
                    }
                ],
                flags: [
                    {
                        set_flag: {
                            flag: "accepted_merchant_quest_2",
                            value: true
                        }
                    }
                ],
            },
            {
                name: "testMerchant_decline_quest_2",
                type: "exit",
                action: { type: "exitWithFlags" },
                parent: "testMerchant_more_slime_trouble",
                conditions: [
                    {
                        has_flag: "has_heard_merchant_troubles",
                        NOT_has_flag: "accepted_merchant_quest_2"
                    }
                ],
                flags: [
                    {
                        set_flag: {
                            flag: "has_heard_merchant_troubles",
                            value: false
                        }
                    }
                ]
            }
        ],
    },
    blacksmithMaroch: {
        always: [
            {
                name: "blacksmithMaroch_store",
                type: "openStore",
                action: { type: "store", id: "blacksmithMaroch_store_normal" }
            },
            {
                name: "blacksmithMaroch_smithing",
                type: "smith",
                action: { type: "smith", id: "blacksmithMaroch_smith" }
            },
            {
                name: "leaveDialog",
                type: "exit",
                action: { type: "exit" },
                displayAtBottom: true,
            }
        ],
        conditional: [
            {
                name: "blacksmithMaroch_",
                type: "quest",
                action: { type: "quest", id: "maroch_slay_brethren", questId: "maroch_slay_brethren_task" },
                conditions: [
                    {
                        NOT_has_flag: "maroch_slay_brethren_quest"
                    }
                ],
                flags: [
                    {
                        set_flag: {
                            flag: "maroch_slay_brethren_quest",
                            value: true
                        }
                    }
                ],
            },
            {
                name: "blacksmithMaroch_brethren_slain",
                type: "quest",
                action: { type: "questObjective", id: "completed_maroch_slay_brethren", questId: "maroch_slay_brethren_task" },
                conditions: [
                    {
                        has_flag: "brethren_slain_talk",
                        NOT_has_flag: "completed_quest_slay_brethren"
                    }
                ],
            },
        ],
    }
};
//# sourceMappingURL=character_interactions.js.map