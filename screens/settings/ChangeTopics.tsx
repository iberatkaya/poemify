import React, { useState, useEffect } from 'react'
import { StyleSheet, View, ScrollView } from 'react-native'
import { Topic } from 'interfaces/Topic';
import { Chip, Title, IconButton, Button } from 'react-native-paper';
import { connect, ConnectedProps } from 'react-redux';
import { setUser } from '../../redux/actions/User';
import { RootState } from '../../redux/store';
import { User } from '../../interfaces/User';
import { EnteranceStackParamList } from 'AppNav';
import { StackNavigationProp } from '@react-navigation/stack';
import { allTopics } from '../../constants/topics';
import firestore from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-community/async-storage';
import { usersCollectionId } from '../../constants/collection';

type EnteranceScreenNavigationProp = StackNavigationProp<EnteranceStackParamList, 'SelectTopics'>;

const mapState = (state: RootState) => ({
    user: state.user
});

const mapDispatch = {
    setUser
};

const connector = connect(mapState, mapDispatch);

type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = PropsFromRedux & {
    navigation: EnteranceScreenNavigationProp;
};

const SelectTopics = (props: Props) => {
    let [selected, setSelected] = useState(allTopics.map(() => false));
    let [loading, setLoading] = useState(false);

    useEffect(() => {
        let myselected = [...selected];
        for(let i in allTopics){
            for(let j in props.user.topics){
                if(allTopics[i] === props.user.topics[j]){
                    myselected[i] = true;      
                }
            }
        }
        setSelected(myselected);
    }, [])

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Title style={styles.title}>Select your topics</Title>
            <View style={styles.topicContainer}>
                {allTopics.map((i, index) => (
                    <Chip
                        mode="outlined"
                        selected={selected[index]}
                        onPress={() => {
                            let items = [...selected];
                            items[index] = !items[index];
                            setSelected(items);
                        }} style={{ margin: 4 }}>
                        {i}
                    </Chip>
                ))}
            </View>
            <Button
                mode="contained"
                dark={true}
                labelStyle={styles.buttonLabel}
                onPress={async () => {
                    if(loading)
                        return;
                    let user = {...props.user};
                    user.topics = allTopics.filter((_i, index) => (selected[index]));
                    props.setUser(user);
                    props.navigation.goBack();
                    await firestore().collection(usersCollectionId).doc(props.user.id).update({ topics: user.topics });
                    await AsyncStorage.setItem('user', JSON.stringify(user));
                }}
            >
                Save
            </Button>

            <IconButton onPress={() => props.navigation.pop()} style={styles.arrowBack} icon="arrow-left" size={32} />

        </ScrollView >
    )
}

export default connector(SelectTopics);

const styles = StyleSheet.create({
    container: {
        paddingTop: 40,
        paddingBottom: 24,
        justifyContent: 'center',
        paddingHorizontal: 12
    },
    buttonLabel: {
        paddingVertical: 6,
    },
    topicContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: 24
    },
    title: {
        paddingTop: 2,
        textAlign: 'center',
        fontSize: 32,
        marginBottom: 32,
    },
    arrowBack: {
        position: 'absolute',
        left: 2,
        top: 4,
    },
});
