import React, { createContext, useState, useContext, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  FlatList,
  Alert,
} from "react-native";

import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// ==================== AUTH CONTEXT ====================
const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => setLoading(false), 800);
  }, []);

  const login = (userData) => setUser(userData);
  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

// ==================== SIGN IN SCREEN ====================
function SignInScreen({ navigation }) {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignIn = () => {
    if (!email || !password) {
      Alert.alert("Lỗi", "Vui lòng nhập đầy đủ email và password");
      return;
    }
    const userData = {
      name: "Hung Nguyen",
      job: "Mobile developer",
      avatar: "https://i.pravatar.cc/300?u=hungnguyen",
      desc: "I have above 5 years of experience in native mobile apps development, now i am learning React Native",
      email: email,
    };
    login(userData);
    navigation.replace("Home");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign In</Text>

      <Text style={styles.label}>Email ID</Text>
      <TextInput
        placeholder="Enter your email here!"
        style={styles.input}
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />

      <Text style={styles.label}>Password</Text>
      <TextInput
        placeholder="Enter your password here!"
        secureTextEntry
        style={styles.input}
        value={password}
        onChangeText={setPassword}
      />

      <Text style={styles.forgot}>Forgot password?</Text>

      <TouchableOpacity style={styles.signButton} onPress={handleSignIn}>
        <Text style={styles.signText}>Sign In</Text>
      </TouchableOpacity>

      <Text style={styles.or}>Or sign in with</Text>

      <View style={styles.socialRow}>
        <View style={styles.google}><Text>Google</Text></View>
        <View style={styles.facebook}><Text style={{ color: "#fff" }}>Facebook</Text></View>
      </View>

      <Text style={styles.signup}>
        Not yet a member? <Text style={{ color: "orange" }}>Sign Up</Text>
      </Text>
    </View>
  );
}

// ==================== EXPLORER SCREEN ====================
function ExplorerScreen() {
  const foods = [
    { id: "1", name: "Pepperoni Pizza", price: "10$", image: "https://images.unsplash.com/photo-1600891964599-f61ba0e24092" },
    { id: "2", name: "Cheese Burger", price: "8$", image: "https://images.unsplash.com/photo-1550547660-d9450f859349" },
    { id: "3", name: "Grilled Steak", price: "15$", image: "https://images.unsplash.com/photo-1544025162-d76694265947" },
    { id: "4", name: "Italian Pasta", price: "12$", image: "https://images.unsplash.com/photo-1555949258-eb67b1ef0ceb?w=400" },
  ];

  return (
    <View style={styles.explorerContainer}>
      <Text style={styles.header}>Explorer</Text>

      <View style={styles.searchBox}>
        <Text style={styles.icon}>📍</Text>
        <TextInput placeholder="Search for meals or area" style={styles.searchInput} />
        <Text style={styles.icon}>🔍</Text>
      </View>

      <View style={styles.rowHeader}>
        <Text style={styles.sectionTitle}>Top Categories</Text>
        <Text style={styles.filter}>Filter</Text>
      </View>

      <View style={styles.categoryRow}>
        {["Pizza", "Burger", "Steak"].map((cat, index) => (
          <View key={index} style={styles.categoryItem}>
            <Image
              source={{ uri: ["https://images.unsplash.com/photo-1594007654729-407eedc4be65", "https://images.unsplash.com/photo-1550547660-d9450f859349", "https://images.unsplash.com/photo-1544025162-d76694265947"][index] }}
              style={styles.categoryImg}
            />
            <Text style={styles.categoryText}>{cat}</Text>
          </View>
        ))}
      </View>

      <View style={styles.rowHeader}>
        <Text style={styles.sectionTitle}>Popular Items</Text>
        <Text style={styles.view}>View all</Text>
      </View>

      <FlatList
        data={foods}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Image source={{ uri: item.image }} style={styles.foodImg} />
            <View style={styles.foodInfo}>
              <Text style={styles.foodName}>{item.name}</Text>
              <Text style={styles.foodBy}>By Viet Nam</Text>
              <Text style={styles.price}>{item.price}</Text>
            </View>
          </View>
        )}
      />
    </View>
  );
}

// ==================== ACCOUNT SCREEN (giống hệt ảnh) ====================
function AccountScreen({ navigation }) {
  const { user, logout } = useContext(AuthContext);

  const handleLogout = () => {
    logout();
    navigation.replace("SignIn");
  };

  if (!user) return <View style={styles.container}><Text>Chưa đăng nhập</Text></View>;

  return (
    <View style={styles.accountContainer}>
      <View style={styles.blueHeader} />
      <Image source={{ uri: user.avatar }} style={styles.avatar} />
      <Text style={styles.name}>{user.name}</Text>
      <Text style={styles.job}>{user.job}</Text>
      <Text style={styles.desc}>{user.desc}</Text>

      <TouchableOpacity style={styles.signButton} onPress={handleLogout}>
        <Text style={styles.signText}>Sign Out</Text>
      </TouchableOpacity>
    </View>
  );
}

// ==================== BOTTOM TAB & APP ====================
function HomeTabs() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen name="Explorer" component={ExplorerScreen} />
      <Tab.Screen name="Account" component={AccountScreen} />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="SignIn" component={SignInScreen} />
          <Stack.Screen name="Home" component={HomeTabs} />
        </Stack.Navigator>
      </NavigationContainer>
    </AuthProvider>
  );
}

// ==================== STYLES ====================
const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20, backgroundColor: "#fff" },
  title: { fontSize: 28, fontWeight: "bold", textAlign: "center", marginBottom: 25 },
  label: { marginBottom: 5, fontSize: 16, color: "#555" },
  input: { borderWidth: 1, borderColor: "#ccc", borderRadius: 8, padding: 12, marginBottom: 15 },
  forgot: { textAlign: "right", color: "orange", marginBottom: 20 },
  signButton: { backgroundColor: "orange", padding: 15, borderRadius: 8, alignItems: "center", marginTop: 10 },
  signText: { color: "#fff", fontWeight: "bold" },
  or: { textAlign: "center", marginTop: 20 },
  socialRow: { flexDirection: "row", justifyContent: "space-between", marginTop: 15 },
  google: { borderWidth: 1, borderColor: "#ccc", width: "45%", padding: 12, alignItems: "center", borderRadius: 8 },
  facebook: { backgroundColor: "#3b5998", width: "45%", padding: 12, alignItems: "center", borderRadius: 8 },
  signup: { textAlign: "center", marginTop: 20 },

  // Explorer
  explorerContainer: { flex: 1, padding: 20, backgroundColor: "#fff" },
  header: { fontSize: 24, fontWeight: "bold" },
  searchBox: { flexDirection: "row", alignItems: "center", borderWidth: 1, borderColor: "#ccc", borderRadius: 12, paddingHorizontal: 10, marginVertical: 15 },
  searchInput: { flex: 1, height: 40 },
  icon: { marginHorizontal: 5, fontSize: 20 },
  rowHeader: { flexDirection: "row", justifyContent: "space-between", marginVertical: 10 },
  sectionTitle: { fontSize: 18, fontWeight: "bold" },
  filter: { color: "orange" },
  view: { color: "orange" },
  categoryRow: { flexDirection: "row", justifyContent: "space-between" },
  categoryItem: { alignItems: "center" },
  categoryImg: { width: 100, height: 60, borderRadius: 10 },
  categoryText: { marginTop: 5, fontSize: 12 },
  card: { flexDirection: "row", marginTop: 15, padding: 10, backgroundColor: "#fff", borderRadius: 12, elevation: 3 },
  foodImg: { width: 70, height: 70, borderRadius: 10 },
  foodInfo: { marginLeft: 10, justifyContent: "center" },
  foodName: { fontWeight: "bold" },
  foodBy: { color: "gray", fontSize: 12 },
  price: { marginTop: 5, fontWeight: "bold" },

  // Account - giống hệt ảnh
  accountContainer: { flex: 1, alignItems: "center", backgroundColor: "#f8f8f8" },
  blueHeader: { width: "100%", height: 180, backgroundColor: "#18A9D6" },
  avatar: { width: 130, height: 130, borderRadius: 65, borderWidth: 5, borderColor: "#fff", position: "absolute", top: 110, zIndex: 10 },
  name: { fontSize: 24, fontWeight: "bold", marginTop: 90 },
  job: { color: "#18A9D6", marginBottom: 15, fontSize: 16 },
  desc: { textAlign: "center", paddingHorizontal: 30, marginBottom: 30, lineHeight: 22, color: "#444" },
});