// 파이어베이스에서 db 가져오기
import { db } from "./firebase";
import { collection, getDocs, addDoc, updateDoc, deleteDoc, query, orderBy, doc } from "firebase/firestore";
import "./App.css";
import { useCallback, useEffect, useState } from "react";

function App() {
  // const [changed, setChanged] = useState(false);
  const [todos, setList] = useState([]);
  const todosCollectionRef = collection(db, "todos");
  const [newList, setNewList] = useState("");

  const getLists = useCallback(async () => {
    const data = await getDocs(query(todosCollectionRef, orderBy("timestamp", "desc")));
    // console.log(data)
    setList(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
  }, [todosCollectionRef]);
  useEffect(() => {
    getLists();
    // setChanged(false);
  }, [getLists]);

  const updateList = async (id, content) => {
    // console.log(id + "/" + content);
    const msg = window.prompt("TO DO", content);

    if (msg) {
      // id를 이용하여 업데이트 할 데이터 검색
      const listDoc = doc(db, "todos", id);
      // 업데이트 할 데이터
      const editField = { content: msg, d_date: now_date, timestamp: new Date() };
      // updateDoc(어떤 데이터, 어떤 값) 데이터 업데이트
      await updateDoc(listDoc, editField);
      //  setChanged(true);
    }
  };

  const deleteList = async (id) => {
    const cfm = window.confirm("Are You sure?");
    if (cfm) {
      // id를 이용하여 삭제 할 데이터 검색
      const listDoc = doc(db, "todos", id);
      // deleteDoc(어떤 데이터, 어떤 값) 데이터 업데이트
      await deleteDoc(listDoc);
    }
    // setChanged(true);
  };

  const showList = todos.map((value) => (
    <div key={value.id}>
      <h2>
        {value.content}
        <span className="date">{value.d_date}</span>
        <button
          onClick={() => {
            updateList(value.id, value.content);
          }}
        >
          EDIT
        </button>
        <button
          onClick={() => {
            deleteList(value.id, value.content);
          }}
        >
          DELETE
        </button>
      </h2>
    </div>
  ));

  const date = new Date();
  const now_date = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();

  const createList = async () => {
    await addDoc(todosCollectionRef, { content: newList, d_date: now_date, timestamp: date });
    // setChanged(true);
  };

  return (
    <div className="App">
      <input type={"text"} placeholder="todos..." onChange={(e) => setNewList(e.target.value)} />
      <button onClick={createList}>Add List</button>
      <hr />
      {showList}
    </div>
  );
}

export default App;
