import React, { useState, useEffect } from 'react'
import { StyleSheet, View, ScrollView } from 'react-native'
import { Chip, Text, Button } from 'react-native-paper';
import { connect, ConnectedProps } from 'react-redux';
import { setUser } from '../../redux/actions/User';
import { RootState } from '../../redux/store';
import { EnteranceStackParamList } from 'AppNav';
import { StackNavigationProp } from '@react-navigation/stack';
import { allTopics } from '../../constants/topics';
import firestore from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-community/async-storage';
import { usersCollectionId } from '../../constants/collection';
import Toast from 'react-native-simple-toast';

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
            <Text style={styles.title}>Change your topics</Text>
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
                loading={loading}
                labelStyle={styles.buttonLabel}
                onPress={async () => {
                    try{
                        setLoading(true);
                        if(loading)
                            return;
                        let user = {...props.user};
                        user.topics = allTopics.filter((_i, index) => (selected[index]));
                        props.setUser(user);
                        props.navigation.goBack();
                        await firestore().collection(usersCollectionId).doc(props.user.id).update({ topics: user.topics });
                        await AsyncStorage.setItem('user', JSON.stringify(user));
                        setLoading(false);
                    } catch(e){
                        setLoading(false);
                        Toast.show("We're sorry but an error occurred :(");
                        console.log(e);
                    }
                }}
            >
                Save
            </Button>
        </ScrollView >
    )
}

export default connector(SelectTopics);

const styles = StyleSheet.create({
    container: {
        paddingTop: 20,
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
        fontSize: 24,
        textAlign: 'center',
        marginBottom: 32,
    },
    arrowBack: {
        position: 'absolute',
        left: 2,
        top: 4,
    },
});
