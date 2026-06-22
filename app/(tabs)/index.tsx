import { useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

import TaskItem from "../../components/TaskItem";
import AddTaskModal from "../../components/AddTaskModal";
import { supabase } from "../../lib/supabase";

type Task = {
  id: string;
  title: string;
  completed: boolean;
  created_at: string;
};

export default function HomeScreen() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [modalVisible, setModalVisible] = useState(false);

  async function loadTasks() {
    const { data, error } = await supabase
      .from("tasks")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) return console.log(error.message);
    setTasks(data);
  }

  async function toggleTask(item: Task) {
    const { error } = await supabase
      .from("tasks")
      .update({ completed: !item.completed })
      .eq("id", item.id);

    if (error) return console.log(error.message);
    loadTasks();
  }

  async function deleteTask(id: string) {
    const { error } = await supabase
      .from("tasks")
      .delete()
      .eq("id", id);

    if (error) return console.log(error.message);
    loadTasks();
  }

  function handleOpenModal() {
    setModalVisible(true);
  }

  async function handleSubmitTask(title: string) {
    const { error } = await supabase
      .from("tasks")
      .insert([{ title, completed: false }]);

    if (error) return console.log(error.message);

    setModalVisible(false);
    loadTasks();
  }

  useEffect(() => {
    loadTasks();
  }, []);

  return (
    <View style={styles.container}>
      <View style={headerStyles.header}>
        <Text style={headerStyles.title}>TaskFlow</Text>

        <TouchableOpacity
          style={styles.addButton}
          onPress={handleOpenModal}
        >
          <MaterialIcons name="add" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TaskItem
            item={item}
            onToggle={toggleTask}
            onDelete={deleteTask}
          />
        )}
      />

      <AddTaskModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSubmit={handleSubmitTask}
      />
    </View>
  );
}

const headerStyles = StyleSheet.create({
  header: {
    paddingTop: 50,
    paddingBottom: 16,
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1F2A44",
  },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: "#fff",
  },
  addButton: {
    backgroundColor: "#2E5BBA",
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
  },
});