import React from 'react'
import { StyleSheet, Text, ScrollView, Platform, View } from 'react-native'
import { Title, IconButton } from "react-native-paper";
import { ProfileStackParamList } from '../../AppNav';
import { StackNavigationProp } from '@react-navigation/stack';

type EnteranceScreenNavigationProp = StackNavigationProp<ProfileStackParamList, 'TOS'>;

type Props = {
    navigation: EnteranceScreenNavigationProp;
};

function TOS(props: Props){
    return (
        <ScrollView contentContainerStyle={styles.container}>
                <Text style={styles.title}>End-User License Agreement (EULA) of Poemify{"\n"}</Text>
                <Text style={styles.para}>{"\t"}This End-User License Agreement ("EULA") is a legal agreement between you and IBK Apps.{"\n"}</Text>

                <Text style={styles.para}>{"\t"}This EULA agreement governs your acquisition and use of our Poemify software ("Software") directly from IBK Apps or indirectly through a IBK Apps authorized reseller or distributor (a "Reseller").{"\n"}</Text>

                <Text style={styles.para}>{"\t"}Please read this EULA agreement carefully before completing the installation process and using the Poemify software. It provides a license to use the Poemify software and contains warranty information and liability disclaimers.{"\n"}</Text>

                <Text style={styles.para}>{"\t"}If you register for a free trial of the Poemify software, this EULA agreement will also govern that trial. By clicking "accept" or installing and/or using the Poemify software, you are confirming your acceptance of the Software and agreeing to become bound by the terms of this EULA agreement.{"\n"}</Text>

                <Text style={styles.para}>{"\t"}If you are entering into this EULA agreement on behalf of a company or other legal entity, you represent that you have the authority to bind such entity and its affiliates to these terms and conditions. If you do not have such authority or if you do not agree with the terms and conditions of this EULA agreement, do not install or use the Software, and you must not accept this EULA agreement.{"\n"}</Text>

                <Text style={styles.para}>{"\t"}This EULA agreement shall apply only to the Software supplied by IBK Apps herewith regardless of whether other software is referred to or described herein. The terms also apply to any IBK Apps updates, supplements, Internet-based services, and support services for the Software, unless other terms accompany those items on delivery. {"\n"}</Text>

                <Text style={styles.title}>License Grant{"\n"}</Text>

                <Text style={styles.para}>{"\t"}IBK Apps hereby grants you a personal, non-transferable, non-exclusive licence to use the Poemify software on your devices in accordance with the terms of this EULA agreement.{"\n"}</Text>

                <Text style={styles.para}>{"\t"}You are permitted to load the Poemify software (for example a PC, laptop, mobile or tablet) under your control. You are responsible for ensuring your device meets the minimum requirements of the Poemify software.{"\n"}</Text>

                <Text style={styles.para}>{"\t"}You are not permitted to:{"\n"}</Text>

                <View>
                <Text style={styles.para}>{"\t"}Edit, alter, modify, adapt, translate or otherwise change the whole or any part of the Software nor permit the whole or any part of the Software to be combined with or become incorporated in any other software, nor decompile, disassemble or reverse engineer the Software or attempt to do any such things{"\n"}</Text>
                <Text style={styles.para}>{"\t"}Reproduce, copy, distribute, resell or otherwise use the Software for any commercial purpose{"\n"}</Text>
                <Text style={styles.para}>{"\t"}Allow any third party to use the Software on behalf of or for the benefit of any third party{"\n"}</Text>
                <Text style={styles.para}>{"\t"}Use the Software in any way which breaches any applicable local, national or international law{"\n"}</Text>
                <Text style={styles.para}>{"\t"}use the Software for any purpose that IBK Apps considers is a breach of this EULA agreement{"\n"}</Text>
                </View>

                <Text style={styles.title}>Intellectual Property and Ownership{"\n"}</Text>

                <Text style={styles.para}>{"\t"}IBK Apps shall at all times retain ownership of the Software as originally downloaded by you and all subsequent downloads of the Software by you. The Software (and the copyright, and other intellectual property rights of whatever nature in the Software, including any modifications made thereto) are and shall remain the property of IBK Apps.{"\n"}</Text>

                <Text style={styles.para}>{"\t"}IBK Apps reserves the right to grant licences to use the Software to third parties.{"\n"}</Text>

                <Text style={styles.title}>Termination{"\n"}</Text>

                <Text style={styles.para}>{"\t"}This EULA agreement is effective from the date you first use the Software and shall continue until terminated. You may terminate it at any time upon written notice to IBK Apps.{"\n"}</Text>

                <Text style={styles.para}>{"\t"}It will also terminate immediately if you fail to comply with any term of this EULA agreement. Upon such termination, the licenses granted by this EULA agreement will immediately terminate and you agree to stop all access and use of the Software. The provisions that by their nature continue and survive will survive any termination of this EULA agreement.{"\n"}</Text>

                <Text style={styles.title}>Governing Law{"\n"}</Text>

                <Text style={styles.para}>{"\t"}This EULA agreement, and any dispute arising out of or in connection with this EULA agreement, shall be governed by and construed in accordance with the laws of US.{"\n"}</Text>
        </ScrollView>
    )
}

export default TOS

const styles = StyleSheet.create({
    container: {
        paddingTop: Platform.OS === 'ios' ? 16 : 40,
        paddingBottom: 16,
        paddingHorizontal: 12,
        justifyContent: 'center',
    },
    para :{
    },
    title: {
        textAlign: "center",
        marginTop: 4,
        fontSize: 24,
        fontWeight: "bold"
    },
    arrowBack: {
        position: 'absolute',
        left: 2,
        top: Platform.OS === 'ios' ? 36 : 4,
    },
})
