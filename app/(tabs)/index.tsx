import React, { useState, useEffect } from 'react';
import {Alert, Text, TextInput, StyleSheet, Button, ScrollView} from 'react-native';
import axios from "axios";

const CalculatorScreen = () => {
  const [result, setResult] = useState(null);

  // Стейты для каждой области тела
  const [headAndNeck, setHeadAndNeck] = useState('');
  const [genitals, setGenitals] = useState('');
  const [leftArm, setLeftArm] = useState('');
  const [rightArm, setRightArm] = useState('');
  const [leftLeg, setLeftLeg] = useState('');
  const [rightLeg, setRightLeg] = useState('');
  const [chestAndAbdomen, setChestAndAbdomen] = useState('');
  const [back, setBack] = useState('');

  // Стейты для интенсивности симптомов (I)
  const [erythema, setErythema] = useState('0');
  const [edema, setEdema] = useState('0');
  const [crusts, setCrusts] = useState('0');
  const [excoriations, setExcoriations] = useState('0');
  const [lichenification, setLichenification] = useState('0');
  const [dryness, setDryness] = useState('0');

  // Стейты для расчета S (Зуд и Нарушение сна)
  const [itching, setItching] = useState('0');
  const [sleepDisturbance, setSleepDisturbance] = useState('0');

  const [A, setA] = useState(0); // Расчет A
  const [I, setB] = useState(0); // Расчет B
  const [S, setS] = useState(0); // Расчет C

  // Функция для вычисления A
  const calculateA = () => {
    const headNeck = parseFloat(headAndNeck) || 0;
    const genital = parseFloat(genitals) || 0;
    const leftArmValue = parseFloat(leftArm) || 0;
    const rightArmValue = parseFloat(rightArm) || 0;
    const leftLegValue = parseFloat(leftLeg) || 0;
    const rightLegValue = parseFloat(rightLeg) || 0;
    const chestAbdomen = parseFloat(chestAndAbdomen) || 0;
    const backValue = parseFloat(back) || 0;

    // Расчет A: сумма всех введенных значений
    const total = (headNeck*9 + genital + leftArmValue*9 + rightArmValue*9 + leftLegValue*18 + rightLegValue*18 + chestAbdomen*18 + backValue*18)/100;
    setA(total);  // Обновление значения A
  };

  // Функция для вычисления I
  const calculateI = () => {
    const erythemaValue = parseInt(erythema) || 0;
    const edemaValue = parseInt(edema) || 0;
    const crustsValue = parseInt(crusts) || 0;
    const excoriationsValue = parseInt(excoriations) || 0;
    const lichenificationValue = parseInt(lichenification) || 0;
    const drynessValue = parseInt(dryness) || 0;

    // Рассчитываем B
    const totalI = erythemaValue + edemaValue + crustsValue + excoriationsValue + lichenificationValue + drynessValue;
    setB(totalI);  // Обновляем значение B
  };

  // Функция для вычисления S
  const calculateS = () => {
    const itchingValue = parseInt(itching) || 0;
    const sleepDisturbanceValue = parseInt(sleepDisturbance) || 0;

    // Рассчитываем C как сумму значений Зуд и Нарушение сна
    const totalS = itchingValue + sleepDisturbanceValue;
    setS(totalS);  // Обновляем значение C
  };

    const calculateBoth = () => {
        calculateA();
        calculateI();
        calculateS();
    };

    const handleCalculate = async () => {
        calculateBoth()

        try {
            const response = await axios.post("http://localhost:8080/api/v1/calculator/calculate", {
                A: A,
                I: I,
                S: S,
            });
            setResult(response.data.result);
            Alert.alert("Результат", `SCORAD индекс: ${response.data.result}`);
        } catch (error) {
            Alert.alert("Ошибка", "Не удалось рассчитать индекс.");
            console.error(error);
        }
    };


  return (
      <ScrollView style={styles.container}>
        <Text style={styles.title}>Площадь поражения (Введите числа от 0 до 100)</Text>

        <Text>Голова и шея (9% всего тела), %</Text>
        <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={headAndNeck}
            onChangeText={setHeadAndNeck}
        />

        <Text>Гениталии (1% всего тела), %</Text>
        <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={genitals}
            onChangeText={setGenitals}
        />

        <Text>Левая рука (9% всего тела), %</Text>
        <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={leftArm}
            onChangeText={setLeftArm}
        />

        <Text>Правая рука (9% всего тела), %</Text>
        <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={rightArm}
            onChangeText={setRightArm}
        />

        <Text>Левая нога (18% всего тела), %</Text>
        <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={leftLeg}
            onChangeText={setLeftLeg}
        />

        <Text>Правая нога (18% всего тела), %</Text>
        <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={rightLeg}
            onChangeText={setRightLeg}
        />

        <Text>Грудь, живот (18% всего тела), %</Text>
        <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={chestAndAbdomen}
            onChangeText={setChestAndAbdomen}
        />

        <Text>Спина (18% всего тела), %</Text>
        <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={back}
            onChangeText={setBack}
        />

        <Text style={styles.title}>Интенсивность (Введите числа от 0 до 3)</Text>

        <Text>Эритема</Text>
        <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={erythema}
            onChangeText={setErythema}
        />

        <Text>Отек/папула</Text>
        <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={edema}
            onChangeText={setEdema}
        />

        <Text>Корки/мокнутие</Text>
        <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={crusts}
            onChangeText={setCrusts}
        />

        <Text>Экскориации</Text>
        <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={excoriations}
            onChangeText={setExcoriations}
        />

        <Text>Лихенификация</Text>
        <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={lichenification}
            onChangeText={setLichenification}
        />

        <Text>Сухость кожи</Text>
        <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={dryness}
            onChangeText={setDryness}
        />

        <Text style={styles.title}>Субъективные симптомы (Введите числа от 0 до 10)</Text>

        <Text>Зуд</Text>
        <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={itching}
            onChangeText={setItching}
        />

        <Text>Нарушение сна</Text>
        <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={sleepDisturbance}
            onChangeText={setSleepDisturbance}
        />

        <Button title="Рассчитать SCORAD" onPress={handleCalculate} />

        <Text style={styles.result}>Площадь пораженной кожи в %: {A}</Text>
        <Text style={styles.result}>Сумма баллов объективных признаков: {I}</Text>
        <Text style={styles.result}>Сумма баллов субъективных признаков: {S}</Text>
      </ScrollView>
  );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 50,
        marginBottom: 80,
        paddingHorizontal: 20,
        backgroundColor: '#f4f4f9',
    },
    title: {
        textAlign: 'center',
        fontSize: 20,
        fontWeight: '700',
        color: '#333',
        marginBottom: 30,
    },
    input: {
        height: 50,
        borderColor: '#ddd',
        borderWidth: 1,
        borderRadius: 12,
        marginBottom: 15,
        paddingLeft: 15,
        backgroundColor: '#fff',
        fontSize: 16,
        color: '#333',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 2,
    },
    result: {
        marginTop: 20,
        fontSize: 20,
        fontWeight: '600',
        color: '#2ecc71',
        textAlign: 'center',
    },
});

export default CalculatorScreen;
