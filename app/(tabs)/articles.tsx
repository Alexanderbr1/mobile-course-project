import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import axios from 'axios';

const ArticlesScreen = () => {
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchArticles = async () => {
            try {
                const response = await axios.get('https://ffdbdc1135c8957f.mokky.dev/articles');
                setArticles(response.data);
            } catch (error) {
                setError("Не удалось загрузить статьи.");
                console.error("Error fetching articles:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchArticles();
    }, []);

    const renderArticleItem = ({ item }) => (
        <View style={styles.articleItem}>
            <Text style={styles.articleTitle}>{item.title}</Text>
            <Text style={styles.articleContent}>{item.content.substring(0, 120)}...</Text>
            <TouchableOpacity style={styles.readMoreButton} onPress={() => Alert.alert("Статья", item.content)}>
                <Text style={styles.readMoreText}>Читать далее</Text>
            </TouchableOpacity>
        </View>
    );

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#5A67D8" />
                <Text style={styles.loadingText}>Загрузка...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.container}>
                <Text style={styles.errorText}>{error}</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Статьи о SCORAD индексе</Text>
            {articles.length > 0 ? (
                <FlatList
                    data={articles}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={renderArticleItem}
                />
            ) : (
                <Text style={styles.noArticlesText}>Статьи не найдены.</Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginTop: 60,
        marginBottom: 80,
        flex: 1,
        padding: 20,
        backgroundColor: '#F7FAFC',
    },
    title: {
        fontSize: 28,
        fontWeight: '700',
        textAlign: 'center',
        color: '#333',
        marginBottom: 20,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F7FAFC',
    },
    loadingText: {
        fontSize: 18,
        color: '#555',
        marginTop: 10,
    },
    articleItem: {
        padding: 18,
        marginBottom: 15,
        borderRadius: 8,
        backgroundColor: '#FFFFFF',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 5,
    },
    articleTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: '#2D3748',
        marginBottom: 10,
    },
    articleContent: {
        fontSize: 16,
        color: '#4A5568',
        lineHeight: 24,
        marginBottom: 12,
    },
    readMoreButton: {
        backgroundColor: '#5A67D8',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 30,
        alignSelf: 'flex-start',
    },
    readMoreText: {
        color: '#FFF',
        fontWeight: '600',
    },
    errorText: {
        fontSize: 18,
        color: '#E53E3E',
        textAlign: 'center',
    },
    noArticlesText: {
        fontSize: 18,
        color: '#A0AEC0',
        textAlign: 'center',
    },
});

export default ArticlesScreen;
