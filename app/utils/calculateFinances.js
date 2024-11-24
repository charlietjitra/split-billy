import { calculateSettlements } from "./calculateSettlements.js"

export const calculateFinances = (expenses, members) => {
    const balances = {};

    members.forEach(member => balances[member] = 0);

    expenses.forEach(expense => {
        balances[expense.paidBy] += expense.amount;

        expense.splitBetween.forEach(split => {
            balances[split.member] -= split.share;
        });
    });

    const settlements = calculateSettlements(balances);

    return { balances, settlements }
}; 


