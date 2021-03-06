import React, { Component, useState } from "react";
import {
	Button,
	View,
	Text,
	TextInput,
	StyleSheet,
	AsyncStorage,
	KeyboardAvoidingView,
	Keyboard,
	TouchableOpacity,
} from "react-native";
import { host, port, makeFetch } from "./utls";

export default function AddPost({ navigation, route }) {
	console.log('addpost')
	console.log(route.params)
	const [post_title, setPost_title] = useState("");
	const [post_content, setPost_content] = useState("");

	let username = route.params.username;
	let userID = route.params.userID;
	let post_message = {
		post_title: post_title,
		post_type: 0,
		user_id: userID,
		user_name: username,
		post_content: post_content,
	};

	return (
		<View style={{ flex: 1, flexDirection: "column" }}>
			<TouchableOpacity
				onPress={() => { Keyboard.dismiss(); }} >
				<TextInput
					style={{ marginTop: 50, marginBottom: 50 }}
					multiline={true}
					placeholder="输入帖子标题"
					onChangeText={(post_title) => setPost_title(post_title)}
				/>
				<TextInput
					style={{ paddingTop: 50, paddingBottom: 200 }}
					multiline={true}
					placeholder="输入帖子内容"
					onChangeText={(post_content) => setPost_content(post_content)}
				/>
				<Button
					title="发布"
					onPress={async () => {
						if (post_title == "") {
							alert("标题为空");
						} else if (post_content == "") {
							alert("内容为空");
						} else {
							url = host + ":" + port + "/forum/post/create";
							data = {
								post_title: post_title,
								post_type: 0,
								user_id: userID,
								user_name: username,
								post_content: post_content,
							};
							console.log(data)
							response = await makeFetch(url, 'POST', data)
							if (response.state == 'Y') {
								alert("创建帖子成功");
								navigation.goBack();
							}
							else {
								alert("创建帖子失败");
								navigation.goBack();
							}
						}
					}}
				/>
			</TouchableOpacity>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#F5FCFF",
	},
	title_view: {
		flexDirection: "row",
		height: 50,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "#27b5ee",
	},
	title_text: {
		fontSize: 20,
		color: "white",
	},
	list: {
		flex: 1,
		paddingTop: 22,
	},
	item: {
		padding: 10,
		fontSize: 18,
		height: 44,
	},
});
