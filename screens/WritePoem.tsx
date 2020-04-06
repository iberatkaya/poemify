import React, { useState } from 'react'
import { StyleSheet, ScrollView, View } from 'react-native'
import { TextInput, HelperText, FAB, IconButton, Divider } from 'react-native-paper';
import Toast from 'react-native-simple-toast';
import RNPickerSelect from 'react-native-picker-select';
import { connect, ConnectedProps } from 'react-redux';
import { RootState } from '../redux/store';
import { StackNavigationProp } from '@react-navigation/stack';
import { addPoem } from '../redux/actions/Poem';
import { addUserPoem } from '../redux/actions/User';
import { HomeStackParamList } from '../AppNav';
import { Poem } from '../interfaces/Poem';
import firestore from '@react-native-firebase/firestore';

type ProfileScreenNavigationProp = StackNavigationProp<
    HomeStackParamList,
    'WritePoem'
>;

const mapState = (state: RootState) => ({
    user: state.user,
    poems: state.poems,
});

const mapDispatch = {
    addPoem,
    addUserPoem
};

const connector = connect(mapState, mapDispatch);

type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = PropsFromRedux & {
    navigation: ProfileScreenNavigationProp;
};


function WritePoem(props: Props) {
    const [title, setTitle] = useState('')
    const [poem, setPoem] = useState('');
    const [lang, setLang] = useState(props.user.preferredLanguages[0]);

    return (
        <View style={styles.container}>
            <ScrollView>
                <TextInput
                    value={title}
                    onChangeText={(text) => setTitle(text)}
                    label="Title"
                />
                <TextInput
                    style={{ fontSize: 16 }}
                    value={poem}
                    label="Poem"
                    onChangeText={(text) => setPoem(text)}
                    multiline={true}
                    numberOfLines={18}
                />
                <RNPickerSelect
                    style={{ fontSize: 40 }}
                    onValueChange={(value) => setLang(value)}
                    placeholder={{}}
                    items={props.user.preferredLanguages.map((i) => ({ value: i, label: i }))}
                    value={lang}
                />
                <HelperText style={{ paddingBottom: 12 }}>Select the poem language</HelperText>
                <Divider style={styles.divider} />
            </ScrollView>
            <FAB
                onPress={async () => {
                    if (title === '') {
                        Toast.show('Title cannot be empty!');
                    }
                    else if (title.length < 3) {
                        Toast.show('Title must be longer than 3 characters!');
                    }
                    else if (poem === '') {
                        Toast.show('The poem cannot be empty!');
                    }
                    else if (poem.length < 3) {
                        Toast.show('The poem must be longer than 3 characters!');
                    }
                    else {
                        let poemid = (props.user.poems.length !== 0) ? props.user.poems[props.user.poems.length - 1].poemId + 1 : 0;
                        let mypoem: Poem = { author: {id: props.user.id, username: props.user.username}, body: poem, date: new Date().getTime(), language: lang, likes: [], poemId: poemid, title: title };
                        let mypoems = [...props.user.poems];
                        mypoems.push(mypoem);

                        /**
                         * Redux Operations
                         */
                        props.addPoem(mypoem);
                        props.addUserPoem(mypoem);
                        props.navigation.pop();

                        /**
                         * Firebase Operations
                         */
                        await firestore().collection('users').doc(props.user.id).update({ poems: mypoems });

                    }
                }}
                style={styles.fab}
                icon="check"
            />
        </View>
    )
}

export default connector(WritePoem);

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#e6e6e6',
        height: '100%'
    },
    divider: {
        backgroundColor: '#b6b6b6',
        height: 2,
        marginTop: 8,
    },
    fab: {
        position: 'absolute',
        marginRight: 16,
        marginBottom: 12,
        right: 0,
        bottom: 0,
    }
})
