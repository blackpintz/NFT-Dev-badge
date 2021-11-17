## Overview

Award contributors with badges for completed assignments, optionally with additional rewards.
Since badges are tradeable, the future rewards for assignments may be sold on and reimbursed by someone else.

## Workflow

The assignment giver adds an assignment to the job contract.
Zero or more reward tokens may be added to the assignment.
The assignment state and reward is locked, and an NFT is minted to the assignment taker.
The NFT token id is stored within the job contract assignment.
(Here the assignment taker may trade on the NFT. Let's call the entity finishing the assignment the "assignment holder.")

## Case A

The assignment giver unlocks the reward when the assignment is complete. 
<!-- a reward could be money that is send to the assignment taker. -->
The assignment holder triggers job contract, which checks that the assignment holder is the (current) holder of the NFT
If yes, rewards are unlocked for the assignment finisher for the assignment.
Assignment finisher may transfer rewards from the job contract.

## Case B

The assignment holder relinquishes the assignment
The rewards are unlocked for the assignment giver's reallocation.

## Job contract data structure

Every job generates a unique ID, and mints one or more NFTs against rewards locked in by the job contract.

## Description

Describes what is to be created and under which conditions the reward will be unlocked.

## Date Due

A simple UTC datetime specifying when the work is due. This has no practical effect in the state of the contract.

## Salt

A quasi-random number generated from the block hash and an internal serial number, to make it harder for the job id hash to be pre-determined

## Rewards

A list of balances of one or more tokens, fungible or not, that have been sent to the contract.
The contract needs to lock balances plegded to a specific assignment.