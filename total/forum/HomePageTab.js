import * as React from 'react';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import HomePageList from './HomeListView'
import { Feather } from '@expo/vector-icons';
import ActionButton from 'react-native-action-button'
import { useNavigation } from '@react-navigation/native';
import ModalDropdown from 'react-native-modal-dropdown';
import { getPostDateAsync } from './utls';
import UserPage from './user';
import {mailList} from './mail'
import {HomePost, HomeAnnounce} from './HomeComponent'

const Tab = createMaterialBottomTabNavigator();
const topTab = createMaterialTopTabNavigator();

function Home({navigation,route}){
    return(
      <topTab.Navigator
          initialRouteName="Announce"
          backBehavior='initialRoute'
      >
          <topTab.Screen
              name='Announce'
              component={HomeAnnounce}
              options={{
                  tabBarLabel:'公告',
              }}
              initialParams={route.params}/>
          <topTab.Screen
              name='HomePost'
              component={HomePost}
              options={{
                  tabBarLabel:'水贴',
              }}
              initialParams={route.params}/>
      </topTab.Navigator>
    );
}



function HomePageTab({ navigation, route }) {
	return (
		<Tab.Navigator
			initialRouteName="Home"
			activeColor="#ffffff"
			inactiveColor='#D3D3D3'
			shifting={true}
			sceneAnimationEnabled={true}
			backBehavior='initialRoute'
		>
			<Tab.Screen
				name='Home'
				component={Home}
				options={{
					tabBarLabel: '首页',
					tabBarColor: '#1E90FF',
					tabBarIcon: ({ focused, color }) => (
						<Feather name='home' color={color} size={26} />
					),
					tabBarColor: '#1E90FF'
				}}
				/* 这里将用户的信息传入到页面中 */
				initialParams={route.params} />
			<Tab.Screen
				name='UserPage'
				/* 这里的component在整合是替换成需要的个人中心页面 */
				component={UserPage}
				options={{
					tabBarLabel: '个人中心',
					tabBarIcon: ({ color, focused }) => (
						<Feather name="user" color={focused ? '#D3D3D3' : color} size={26} />
					),
					tabBarColor: '#FFFFFF',
				}}
				/* 这里将用户的信息传入到页面中 */
				initialParams={route.params} />
			<Tab.Screen
				name='Mail'
				/* 这里的component在整合是替换成需要的站内信页面 */
				component={mailList}
				options={{
					tabBarLabel: '站内信',
					tabBarIcon: ({ color }) => (
						<Feather name="mail" color={color} size={26} />
					),
					tabBarColor: '#FF0000'
				}}
				/* 这里将用户的信息传入到页面中 */
				initialParams={route.params} />
		</Tab.Navigator>
	);
}


function Mail({ navigation, route }) {
    /**
     * 这里是站内信
     */

	return (
		<View style={styles.container}>
			<Text style={styles.text}>这是站内信页面</Text>
		</View>
	);
}

function MyPostComponent({ userInfo }) {
	const navigation = useNavigation();
	return (
		<ActionButton
			size={40}
			buttonColor='rgba(255,140,0,1)'  //这里可以修改发布按钮的底色
			offsetX={30}
			offsetY={30}
			onPressIn={(event) => { navigation.navigate('PostPage', { ...userInfo }) }}
			renderIcon={() => (<Feather name='plus' color='#ffffff' size={40} />)}
		>
		</ActionButton>
	);
}


const styles = StyleSheet.create({
	/**
	 * 这里是UI，保证各个页面的UI在这里修改
	 */
	container: {
		flex: 1,
		flexDirection: 'column',
		justifyContent: 'center',
		alignItems: 'center',
	},
	text: {
		fontSize: 18,
		fontStyle: 'italic',
		color: 'red',
		backgroundColor: '#AEEEEE',
		height: 24,
		textAlignVertical: 'center',
		textAlign: 'center',
	},
	post: {
		flexDirection: 'column',
		height: 300,
		backgroundColor: '#DCDCDC',
		paddingLeft: 10,
		paddingRight: 10,
	},
	poster: {
		fontSize: 24,
		fontWeight: 'bold',
		fontStyle: 'italic',
		color: '#1E90FF'
	},
	postHeader: {
		height: 60,
		fontSize: 36,
		paddingTop: 20,
	},
	postContent: {
		fontSize: 24,
		height: 180,
	},
	postDate: {
		height: 20,
		fontSize: 16,
		textAlignVertical: 'center',
	},
	postView: {
		height: 25,
		flexDirection: 'row',
		justifyContent: 'flex-start',
		alignItems: 'center',
	},
	select: {  //下拉列表在homePage中的style
		height: 18,
		flexDirection: 'row',
		justifyContent: 'flex-end',
		paddingEnd: 20,
	},
	selectItem: { //下拉列表的每一行的style
		height: 18,
		alignItems: 'center',
	},
	selectText: { //下拉列表中每一行中的文本的style
		fontSize: 14,
		marginTop: 2,
	},
});

export default HomePageTab;