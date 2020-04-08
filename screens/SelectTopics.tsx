import React, { useState, useEffect } from 'react'
import { StyleSheet, View, ScrollView } from 'react-native'
import { Chip, Title, IconButton, Button, Text, Divider } from 'react-native-paper';
import { connect, ConnectedProps } from 'react-redux';
import { setUser } from '../redux/actions/User';
import { RootState } from '../redux/store';
import { EnteranceStackParamList } from 'AppNav';
import { StackNavigationProp } from '@react-navigation/stack';
import { allTopics } from '../constants/topics';

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
            <Text style={styles.title}>Select topics you are interested in</Text>
            <Divider style={styles.divider} />
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
                loading={loading}
                dark={true}
                labelStyle={styles.buttonLabel}
                onPress={async () => {
                    if(loading)
                        return;
                    let user = {...props.user};
                    user.topics = allTopics.filter((_i, index) => (selected[index]));
                    props.setUser(user);
                    props.navigation.pop();
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
        fontSize: 28,
    },
    arrowBack: {
        position: 'absolute',
        left: 2,
        top: 4,
    },
    divider: {
        height: 1,
        marginVertical: 24,
    },
});
