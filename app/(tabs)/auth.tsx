import {router} from 'expo-router'
import React, {useState} from 'react'
import {
    View,
    Text,
    TextInput,
    ScrollView,
    StyleSheet,
    Platform,
    KeyboardAvoidingView,
    TouchableWithoutFeedback,
    Keyboard,
    TouchableOpacity,
} from 'react-native'
import {useAuth} from '@/context/auth'
import {http} from '@/api/http'

interface AuthResponse {
    action: string,
    access_token: string
}

const FormScreen = () => {
    const {isAuthenticated, user, login, logout} = useAuth()
    const [isLogin, setIsLogin] = useState(true)
    const [name, setName] = useState<string>('')
    const [username, setUsername] = useState<string>('')
    const [password, setPassword] = useState<string>('')

    const handleSubmit = async () => {
        if (isLogin) {
            try {
                const response = await http.post<AuthResponse>('http://localhost:8080/auth/sign-in', {
                    username,
                    password,
                })

                if (response.status === 200) {
                    const {access_token} = response.data.token
                    await login(access_token)
                    router.push('/(tabs)')
                    setUsername('')
                    setPassword('')
                }
            } catch (error) {
                console.log('Ошибка:', error)
            }
        } else {
            try {
                const response = await http.post<AuthResponse>(
                    'http://localhost:8080/auth/sign-up',
                    {
                        name,
                        username,
                        password,
                    }
                )
                if (response.status === 200) {
                    const {access_token} = response.data
                    await login(access_token)
                    router.push('/(tabs)')
                    setUsername('')
                    setPassword('')
                }
            } catch (error) {
                console.log('Ошибка:', error)
            } finally {
                setIsLogin(true)
                setUsername('')
                setPassword('')
            }
        }
    }

    const handleLogout = async () => {
        await http.get('/auth/logout')
        delete http.defaults.headers.common.Authorization
        await logout()
    }

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <ScrollView contentContainerStyle={styles.scrollContainer}>
                    {isAuthenticated ? (
                        <View style={styles.authenticatedContainer}>
                            <Text style={styles.header}>Вы авторизованы</Text>
                            <TouchableOpacity style={styles.button} onPress={handleLogout}>
                                <Text style={styles.buttonText}>Выйти</Text>
                            </TouchableOpacity>
                        </View>
                    ) : (
                        <>
                            <Text style={styles.header}>
                                {isLogin ? 'Вход' : 'Регистрация'}
                            </Text>

                            <View style={styles.form}>
                                {!isLogin && (
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Имя"
                                        value={name}
                                        onChangeText={setName}
                                        placeholderTextColor="#999"
                                    />
                                )}

                                <TextInput
                                    style={styles.input}
                                    placeholder="Ник"
                                    value={username}
                                    onChangeText={setUsername}
                                    keyboardType="email-address"
                                    placeholderTextColor="#999"
                                />
                                <TextInput
                                    style={styles.input}
                                    placeholder="Пароль"
                                    value={password}
                                    onChangeText={setPassword}
                                    secureTextEntry
                                    placeholderTextColor="#999"
                                />

                                <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                                    <Text style={styles.buttonText}>
                                        {isLogin ? 'Войти' : 'Зарегистрироваться'}
                                    </Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={styles.switchButton}
                                    onPress={() => setIsLogin(!isLogin)}
                                >
                                    <Text style={styles.switchButtonText}>
                                        {isLogin
                                            ? 'Зарегистрироваться'
                                            : 'Войти'}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </>
                    )}
                </ScrollView>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    scrollContainer: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    header: {
        fontSize: 32,
        fontWeight: 'bold',
        marginBottom: 30,
        textAlign: 'center',
        color: '#2ecc71'
    },
    form: {
        width: '100%',
        alignItems: 'center',
    },
    input: {
        width: '100%',
        backgroundColor: '#fff',
        borderColor: '#ddd',
        borderWidth: 1,
        borderRadius: 8,
        paddingVertical: 10,
        paddingHorizontal: 15,
        marginBottom: 15,
        fontSize: 16,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    button: {
        width: '100%',
        backgroundColor: '#2ecc71',
        borderRadius: 8,
        paddingVertical: 15,
        alignItems: 'center',
        marginBottom: 15,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '600',
    },
    switchButton: {
        marginTop: 10,
    },
    switchButtonText: {
        color: '#53a4ff',
        fontSize: 16,
    },
    authenticatedContainer: {
        alignItems: 'center',
        marginTop: 20,
    },
})

export default FormScreen
