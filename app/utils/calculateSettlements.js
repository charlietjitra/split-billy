export const calculateSettlements = (balances) => {
    const settlements = [];
    const debtors = Object.entries(balances)
        .filter(([, balance]) => balance < -0.01)
        .sort(([, a], [, b]) => a - b);
    
    const creditors = Object.entries(balances)
        .filter(([, balance]) => balance > 0.01)
        .sort(([, a], [, b]) => b - a);

    let debtorIndex = 0;
    let creditorIndex = 0;

    while (debtorIndex < debtors.length && creditorIndex < creditors.length) {
        const [debtor, debtAmount] = debtors[debtorIndex];
        const [creditor, creditAmount] = creditors[creditorIndex];

        const transferAmount = Math.min(Math.abs(debtAmount), creditAmount);

        if (transferAmount > 0.01) {
            settlements.push({
                from: debtor,
                to: creditor,
                amount: Number(transferAmount.toFixed(2))
            });

            // Update balances
            balances[debtor] += transferAmount;
            balances[creditor] -= transferAmount;
        }

        // Move to next person if balance is settled
        if (Math.abs(balances[debtor]) < 0.01) debtorIndex++;
        if (Math.abs(balances[creditor]) < 0.01) creditorIndex++;
    }

    return settlements;
}

