import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity} from "react-native";
import { LinearGradient } from 'expo-linear-gradient';


import { FontAwesome, Ionicons } from "@expo/vector-icons";

type Transaction = {
  transaction_type: "cashback" | "withdrawal" | "payment" | "received";
  date: string;
  amount: number;
  to: string;
  image: string;
};

const transactions: (Transaction & { to?: string, image?: string })[] = [
    { "transaction_type": "payment", "date": "2025-02-27", "amount": 2500, "to": "Muthokinju", "image": require("../assets/images/muthokinju.png") },
    { "transaction_type": "cashback", "date": "2025-02-27", "amount": 50, "to": "Muthokinju", "image": require("../assets/images/muthokinju.png") },
    { "transaction_type": "withdrawal", "date": "2025-02-27", "amount": 5000, "to": "mpesa", "image": require("../assets/images/mpesa.png") },
    { "transaction_type": "received", "date": "2025-02-27", "amount": 8000, "to": "William Ruto", "image": require("../assets/images/ruto.png") },
    { "transaction_type": "payment", "date": "2025-02-28", "amount": 3000, "to": "Muthokinju", "image": require("../assets/images/muthokinju.png") },
    { "transaction_type": "cashback", "date": "2025-02-28", "amount": 75, "to": "Muthokinju", "image": require("../assets/images/muthokinju.png") },
    { "transaction_type": "withdrawal", "date": "2025-02-27", "amount": 2500, "to": "absa bank", "image": require("../assets/images/absa.png") },
    { "transaction_type": "received", "date": "2025-02-28", "amount": 12000, "to": "William Ruto", "image": require("../assets/images/ruto.png") },
    { "transaction_type": "received", "date": "2025-03-04", "amount": 7500, "to": "William Ruto", "image": require("../assets/images/ruto.png") },
    { "transaction_type": "payment", "date": "2025-02-27", "amount": 1800, "to": "Muthokinju", "image": require("../assets/images/muthokinju.png") },
    { "transaction_type": "cashback", "date": "2025-02-27", "amount": 40, "to": "Muthokinju", "image": require("../assets/images/muthokinju.png") },
    { "transaction_type": "withdrawal", "date": "2025-02-28", "amount": 3500, "to": "mpesa", "image": require("../assets/images/mpesa.png") },
    { "transaction_type": "received", "date": "2025-02-28", "amount": 6700, "to": "William Ruto", "image": require("../assets/images/ruto.png") },
    { "transaction_type": "payment", "date": "2025-03-01", "amount": 2700, "to": "Muthokinju", "image": require("../assets/images/muthokinju.png") },
    { "transaction_type": "cashback", "date": "2025-03-01", "amount": 65, "to": "Muthokinju", "image": require("../assets/images/muthokinju.png") },
    { "transaction_type": "withdrawal", "date": "2025-03-02", "amount": 5200, "to": "absa bank", "image": require("../assets/images/absa.png") },
    { "transaction_type": "received", "date": "2025-03-02", "amount": 8900, "to": "William Ruto", "image": require("../assets/images/ruto.png") },
    { "transaction_type": "payment", "date": "2025-03-03", "amount": 3100, "to": "Muthokinju", "image": require("../assets/images/muthokinju.png") },
    { "transaction_type": "cashback", "date": "2025-03-03", "amount": 70, "to": "Muthokinju", "image": require("../assets/images/muthokinju.png") },
    { "transaction_type": "withdrawal", "date": "2025-03-04", "amount": 4300, "to": "mpesa", "image": require("../assets/images/mpesa.png") },
    { "transaction_type": "received", "date": "2025-03-04", "amount": 9600, "to": "William Ruto", "image": require("../assets/images/ruto.png") },
];
  
  const groupTransactionsByDate = (transactions: Transaction[]) => {
    return transactions.reduce((acc, transaction) => {
      if (!acc[transaction.date]) {
        acc[transaction.date] = [];
      }
      acc[transaction.date].push(transaction);
      return acc;
    }, {} as Record<string, Transaction[]>);
  };
  
  const groupedTransactions = groupTransactionsByDate(transactions);

  const getTransactionColor = (type: string) => {
    switch (type.toLowerCase()) {
      case "payment":
        return "purple"; 
      case "withdrawal":
        return "#d9534f"; 
      case "cashback":
        return "#5cb85c";
      case "received":
        return "#5cb85c"; 
      default:
        return "#333"; 
    }
  };
  
  const TransactionItem: React.FC<{ transaction: Transaction }> = ({ transaction }) => {
    return (
        <View style={styles.transactionItem}>
        {/* Transaction Image */}
        <Image 
            source={typeof transaction.image === "string" ? { uri: transaction.image } : transaction.image} 
            style={styles.transactionImage} 
            />
        {/* Transaction Details */}
        <View style={styles.transactionDetails}>
        <Text style={styles.transactionTo}>{transaction.to}</Text>
        <Text style={[styles.transactionType, { color: getTransactionColor(transaction.transaction_type) }]}>
          {transaction.transaction_type}
        </Text>
        </View>
  
        {/* Transaction Amount */}
        <Text style={styles.transactionAmount}>Ksh.{transaction.amount}</Text>
      </View>
    );
  };

const wallets: React.FC = () => {
    const [isVisible, setIsVisible] = useState(true);
    
  return (
    <View style={styles.container}>
    <LinearGradient
        colors={["#BDB5D5", "#F5F5F5"]} // Purple to light gray
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
      />
      {/* Card Section */}
      <View style={styles.cardContainer}>
      <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>Available Balance</Text>
                <TouchableOpacity onPress={() => setIsVisible(!isVisible)}>
                    <Ionicons 
                        name={isVisible ? "eye" : "eye-off-sharp"} 
                        size={30} 
                        color="white" 
                    />
                </TouchableOpacity>
            </View>
            <Text style={styles.balanceAmt}>
                {isVisible ? 'KES 25,000' : '******'}
            </Text>
        <View style={styles.makeTransaction}>
            <View style={styles.transactionOption}>
                <Ionicons name="add-circle-sharp" size={45} color="white" />
                <Text style={styles.transactionOptionText}>Add</Text>
            </View>
            <View style={styles.transactionOption}>
                <Ionicons name="card" size={37} color="white" />
                <Text style={styles.transactionOptionText}>Pay</Text>
            </View>
            <View style={styles.transactionOption}>
                <Ionicons name="arrow-down-circle-sharp" size={35} color="white" />
                <Text style={styles.transactionOptionText}>Withdraw</Text>
            </View>
            <View style={styles.transactionOption}>
                <FontAwesome name="send" size={30} color="white" />
                <Text style={styles.transactionOptionText}>Send</Text>
            </View>
        </View>
      </View>

      {/* Transactions */}
      <View style={styles.transactionsHeader}><Text style={styles.sectionTitle}>Recent Transactions</Text><Text>View All</Text></View>
      <FlatList
        data={Object.keys(groupedTransactions)}
        keyExtractor={(date) => date}
        renderItem={({ item: date }) => (
          <View>
            <Text style={styles.transactionDate}>{date}</Text>
            {groupedTransactions[date].map((transaction, index) => (
              <TransactionItem key={index} transaction={transaction} />
            ))}
          </View>
        )}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default wallets;

const styles = StyleSheet.create({
    gradient: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        height: "60%", // Covers 1/3 of the screen
      },
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    paddingHorizontal: 20,
    paddingTop: 50
  },
  cardContainer: {
    backgroundColor: "#9D00FF",
    padding: 15,
    borderRadius: 15,
    marginBottom: 15
  },
    cardHeader: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 10
    },
    balanceAmt: {
        color: "white",
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 20
    },
    makeTransaction: {
        flexDirection: "row",
        justifyContent: "space-between", 
        marginBottom: 20
    },   
    transactionOption: {
        alignItems: "center",
        justifyContent: "center",
        
    },
    transactionOptionText: {
        color: "white",
        fontSize: 14,
        marginTop: 5,
        fontWeight: "bold"
    },
    transactionTo:{
        fontWeight:"bold"
    },
    transactionImage:{
        height:50,
        width:50
    },
  cardTitle: {
    color: "white",
    fontSize: 16,
    marginBottom: 10
  },
  card: {
    backgroundColor: "#660066",
    padding: 20,
    borderRadius: 15,
    alignItems: "center"
  },
  cardIcon: {
    marginBottom: 10
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "bold",
    marginBottom: 7
  },
  transactionsHeader:{
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10
  },
  transactionItem: {
    flexDirection: "row",
    padding: 15,
    marginVertical: 8,
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomColor:"gray",
    borderBottomWidth: 0.6
  },
  transactionDate:{
    fontSize: 18,
    fontWeight: "bold",
    color: "gray",
    marginBottom: 10
    
  },
  transactionDetails: {
    flex: 1,
    marginLeft: 10
  },
  transactionType: {
    fontSize: 16,
    color: "#333"
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333"
    
  }
});