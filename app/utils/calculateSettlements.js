export const calculateSettlements = (balances) => {
    const settlements = [];
    
    // Create arrays of debtors and creditors
    const debtors = Object.entries(balances)
        .filter(([, balance]) => balance < -0.01)
        .sort(([, a], [, b]) => a - b);
    
    const creditors = Object.entries(balances)
        .filter(([, balance]) => balance > 0.01)
        .sort(([, a], [, b]) => b - a);
    
    // Create a copy of balances to manipulate
    const workingBalances = {...balances};
    
    // Iterate through debtors
    for (let [debtor, debtAmount] of debtors) {
        // Convert to absolute value of debt
        debtAmount = Math.abs(debtAmount);
        
        // Iterate through creditors
        for (let [creditorIndex, [creditor, creditAmount]] of creditors.entries()) {
            if (debtAmount <= 0) break;
            
            // Determine transfer amount
            const transferAmount = Math.min(debtAmount, creditAmount);
            
            if (transferAmount > 0.01) {
                settlements.push({
                    from: debtor,
                    to: creditor,
                    amount: Number(transferAmount.toFixed(2))
                });
                
                // Update working balances
                workingBalances[debtor] += transferAmount;
                workingBalances[creditor] -= transferAmount;
                
                // Reduce debt and credit amounts
                debtAmount -= transferAmount;
                creditors[creditorIndex][1] -= transferAmount;
            }
        }
    }
    
    return settlements;
};