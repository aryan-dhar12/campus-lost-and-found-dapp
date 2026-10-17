# Test Plan and Expected Results

Run these tests using separate Ganache accounts. Capture one screenshot for each test while the transaction result or error is visible.

| ID | Type | Steps | Expected result |
|---|---|---|---|
| T1 | Valid | Account A registers a Blue Water Bottle with all required fields. | Transaction succeeds; item #1 appears with status Open. |
| T2 | Valid | Account B requests a claim for item #1. | Transaction succeeds; status changes to Claim requested and claimant is Account B. |
| T3 | Valid | Switch back to Account A, approve the claim, then mark item #1 returned. | Both transactions succeed; status changes to Claim approved, then Returned. |
| T4 | Invalid | Try to register an item with a title shorter than 3 characters. | Transaction reverts with "Title must contain at least 3 characters". |
| T5 | Invalid | Try to claim an item ID that does not exist. | Transaction reverts with "Item does not exist". |
| T6 | Unauthorised | Account B tries to mark item #1 returned. | Transaction reverts with "Only the finder can perform this action". |
| T7 | Unauthorised | The finder tries to claim their own item. | Transaction reverts with "Finder cannot claim their own item". |

Record the actual transaction hashes, deployed address, and screenshots in the README before submission.
