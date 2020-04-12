import React, { useState } from 'react';
import { StyleSheet, ScrollView, View, Platform, InputAccessoryView } from 'react-native';
import { TextInput, HelperText, FAB, Button, Divider } from 'react-native-paper';
import Toast from 'react-native-simple-toast';
import RNPickerSelect from 'react-native-picker-select';
import { connect, ConnectedProps } from 'react-redux';
import { RootState } from '../redux/store';
import { StackNavigationProp } from '@react-navigation/stack';
import { addPoem } from '../redux/actions/Poem';
import { addUserPoem, incTotalPoem, decTotalPoem } from '../redux/actions/User';
import { HomeStackParamList } from '../AppNav';
import { Poem } from '../interfaces/Poem';
import firestore from '@react-native-firebase/firestore';
import { usersCollectionId, poemsCollectionId } from '../constants/collection';
import { allTopics } from '../constants/topic';

type ProfileScreenNavigationProp = StackNavigationProp<HomeStackParamList, 'WritePoem'>;

const mapState = (state: RootState) => ({
    user: state.user,
    poems: state.poems,
});

const mapDispatch = {
    addPoem,
    addUserPoem,
    incTotalPoem, 
    decTotalPoem
};

const connector = connect(mapState, mapDispatch);

type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = PropsFromRedux & {
    navigation: ProfileScreenNavigationProp;
};

function WritePoem(props: Props) {
    const [title, setTitle] = useState('');
    const [poem, setPoem] = useState('');
    const [lang, setLang] = useState(props.user.preferredLanguages[0]);
    const [topics, setTopics] = useState([props.user.topics[0], props.user.topics[1]]);
    const [loading, setLoading] = useState(false);

    return (
        <View style={styles.container}>
            <ScrollView>
                <TextInput
                    returnKeyType="done"
                    autoCapitalize="words"
                    maxLength={50}
                    value={title}
                    onChangeText={(text) => setTitle(text)}
                    label="Title"
                />
                <TextInput
                    returnKeyLabel="Done"
                    returnKeyType="next"
                    style={{ fontSize: 16 }}
                    value={poem}
                    inputAccessoryViewID={Platform.OS === 'ios' ? 'done' : undefined}
                    label="Poem"
                    maxLength={750}
                    onChangeText={(text) => setPoem(text)}
                    multiline={true}
                    numberOfLines={Platform.OS === 'ios' ? undefined : 18}
                    //@ts-ignore
                    minHeight={Platform.OS === 'ios' && 18 ? 20 * 18 : undefined}
                />
                {Platform.OS === 'ios' ? (
                    <InputAccessoryView
                        nativeID="done"
                        style={{ alignSelf: 'flex-end', justifyContent: 'flex-end', alignItems: 'flex-end', alignContent: 'flex-end' }}
                    >
                        <Button style={{ alignSelf: 'flex-end', width: 120 }} mode="contained" onPress={() => {}}>
                            Done
                        </Button>
                    </InputAccessoryView>
                ) : (
                    <View />
                )}
                <View style={styles.pickerContainer}>
                    <RNPickerSelect
                        onValueChange={(value) => setLang(value)}
                        placeholder={{}}
                        style={pickerSelectStyles}
                        items={props.user.preferredLanguages.map((i) => ({ value: i, label: i }))}
                        value={lang}
                    />
                </View>
                <HelperText style={styles.helpText}>Select the poem language</HelperText>
                <Divider style={styles.divider} />
                <View style={styles.pickerContainer}>
                    <RNPickerSelect
                        onValueChange={(value) => {
                            let mytopics = [...topics];
                            mytopics[0] = value;
                            setTopics(mytopics);
                        }}
                        placeholder={{}}
                        style={pickerSelectStyles}
                        items={allTopics.filter((j) => j !== topics[1]).map((i) => ({ value: i, label: i }))}
                        value={topics[0]}
                    />
                </View>
                <HelperText style={styles.helpText}>Select the first poem topic</HelperText>
                <Divider style={styles.divider} />
                <View style={styles.pickerContainer}>
                    <RNPickerSelect
                        onValueChange={(value) => {
                            let mytopics = [...topics];
                            mytopics[1] = value;
                            setTopics(mytopics);
                        }}
                        placeholder={{}}
                        style={pickerSelectStyles}
                        items={allTopics.filter((j) => j !== topics[0]).map((i) => ({ value: i, label: i }))}
                        value={topics[1]}
                    />
                </View>
                <HelperText style={styles.helpText}>Select the second poem topic</HelperText>
                <Divider style={styles.divider} />
            </ScrollView>
            <FAB
                onPress={async () => {
                    if(loading)
                        return;
                    try {
                        if (title === '') {
                            Toast.show('Title cannot be empty!');
                        } else if (title.length < 3) {
                            Toast.show('Title must be longer than 3 characters!');
                        } else if (poem === '') {
                            Toast.show('The poem cannot be empty!');
                        } else if (poem.length < 3) {
                            Toast.show('The poem must be longer than 3 characters!');
                        } else {
                            setLoading(true);
                            let poemid = props.user.poems.length !== 0 ? props.user.poems[props.user.poems.length - 1].poemId + 1 : 0;
                            let mypoem: Poem = {
                                author: { docid: props.user.docid, username: props.user.username, uid: props.user.uid },
                                body: poem,
                                docid: '-1',
                                username: props.user.username,
                                topics: topics,
                                date: new Date().getTime(),
                                language: [lang],
                                likes: [],
                                poemId: poemid,
                                title: title,
                                bookmarkedBy: [],
                                comments: [],
                            };
                            let mypoems = [...props.user.poems];
                            
                            /**
                             * Firebase Operations
                             */

                            let res = await firestore().collection(usersCollectionId).doc(props.user.docid).collection("userpoems").add( mypoem );
                            await firestore().collection(usersCollectionId).doc(props.user.docid).collection("userpoems").doc(res.id).update({docid: res.id});

                            
                            let res2 = await firestore().collection(poemsCollectionId).add(mypoem);
                            await firestore().collection(poemsCollectionId).doc(res2.id).update({docid: res2.id});
                            
                            mypoem.docid = res2.id;
                            
                            /**
                             * Redux Operations
                             */
                            
                            mypoems.push(mypoem);
                            props.addPoem(mypoem);
                            props.addUserPoem(mypoem);

                            let ctr = props.user.totalPoems + 1;
                            props.incTotalPoem();

                            
                            await firestore().collection(usersCollectionId).doc(props.user.docid).update({ totalPoems: ctr });

                            props.navigation.pop();
                            
                        }
                    } catch (e) {
                        console.log(e);
                        if (
                            e.toString() ===
                            'Error: [firestore/permission-denied] The caller does not have permission to execute the specified operation.'
                        ) {
                            Toast.show('An error occurred!');
                        } else {
                            Toast.show('Please check your internet connection!');
                        }
                    }
                }}
                style={styles.fab}
                icon={loading ? "circle-outline" : "check"}
            />
        </View>
    );
}

export default connector(WritePoem);

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#ededed',
        height: '100%',
    },
    pickerContainer: {
        marginLeft: 4,
    },
    divider: {
        backgroundColor: '#b6b6b6',
        height: 2,
        marginTop: 2,
    },
    helpText: {
        paddingBottom: 8,
    },
    fab: {
        position: 'absolute',
        marginRight: 16,
        marginBottom: 12,
        right: 0,
        bottom: 0,
    },
});

const pickerSelectStyles = StyleSheet.create({
    inputIOS: {
        fontSize: 16,
        paddingVertical: 12,
        paddingHorizontal: 10,
    },
    inputAndroid: {},
});
