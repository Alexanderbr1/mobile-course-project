import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import axios from 'axios';

const HistoryScreen = () => {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Загружаем историю расчетов при монтировании компонента
        const fetchHistory = async () => {
            try {
                const response = await axios.get("http://localhost:8080/api/v1/calculator/history");
                setHistory(response.data.data); // предполагаем, что ответ имеет поле 'data'
            } catch (error) {
                Alert.alert("Ошибка", "Не удалось загрузить историю расчетов.");
                console.error("Error fetching history:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchHistory();
    }, []);

    // Рендерим каждую запись истории
    const renderHistoryItem = ({ item }) => (
        <View style={styles.historyItem}>
            <Text style={styles.dateText}>
                {new Date(item.created_at).toLocaleString()}
            </Text>
            <Text style={styles.resultText}>
                SCORAD индекс: {item.result.toFixed(2)}
            </Text>
        </View>
    );

    if (loading) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" color="#3498db" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>История расчетов</Text>
            {history.length > 0 ? (
                <FlatList
                    data={history}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={renderHistoryItem}
                    contentContainerStyle={styles.flatListContainer}
                />
            ) : (
                <Text style={styles.noHistoryText}>История пуста.</Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginTop: 40,
        marginBottom: 60,
        flex: 1,
        backgroundColor: '#f4f4f9',
        paddingHorizontal: 20,
        paddingVertical: 30,
    },
    title: {
        fontSize: 28,
        fontWeight: '700',
        color: '#333',
        textAlign: 'center',
        marginBottom: 20,
    },
    flatListContainer: {
        paddingBottom: 30,
    },
    historyItem: {
        backgroundColor: '#fff',
        marginBottom: 15,
        padding: 20,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 2,
    },
    dateText: {
        fontSize: 14,
        color: '#7f8c8d',
        marginBottom: 10,
    },
    resultText: {
        fontSize: 18,
        fontWeight: '500',
        color: '#2ecc71',
    },
    noHistoryText: {
        fontSize: 18,
        color: '#95a5a6',
        textAlign: 'center',
    },
});

export default HistoryScreen;
