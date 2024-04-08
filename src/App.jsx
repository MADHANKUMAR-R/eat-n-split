import { useState } from "react";

/* eslint-disable react/prop-types */
const initialFriends = [
  {
    id: 118836,
    name: "Clark",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
  },
  {
    id: 933372,
    name: "Sarah",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },
  {
    id: 499476,
    name: "Anthony",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];

export default function App() {
  const [friends, setFriend] = useState(initialFriends);
  const [showAddFriend, setShowAddFriend] = useState(false);
  const [selectedFriend, setSelectedFriend] = useState(null);
  function handleAddFriend(friend) {
    setFriend((friends) => [...friends, friend]);
    setShowAddFriend(false);
  }
  function handleShowAddFriend() {
    setShowAddFriend((show) => !show);
  }

  function handleSelection(friend) {
    // setSelectedFriend(friend);
    setSelectedFriend((cur) => (cur?.id === friend.id ? null : friend));
    setShowAddFriend(false);
  }
  function handleSplitBill(value) {
    setFriend((friends) =>
      friends.map((friend) =>
        friend.id === selectedFriend.id
          ? { ...friend, balance: friend.balance + value }
          : friend
      )
    );
  }
  return (
    <div className="flex  justify-center items-center space-x-10 min-h-screen">
      <div className="flex flex-col ">
        <FriendList
          friends={friends}
          onSelection={handleSelection}
          selectedFriend={selectedFriend}
        />
        {showAddFriend && <FormFriend onAddFriend={handleAddFriend} />}
        <div className="self-end p-3 mt-4">
          <Button onClick={handleShowAddFriend}>
            {showAddFriend ? "Close" : "Add friend"}
          </Button>
        </div>
      </div>
      <div>
        {selectedFriend && (
          <FormSplittingBill
            selectedFriend={selectedFriend}
            key={selectedFriend.id}
            onSplitBill={handleSplitBill}
          />
        )}
      </div>
    </div>
  );
}

function FriendList({ friends, onSelection, selectedFriend }) {
  return (
    <div>
      <ul className="overflow-y-auto h-64 border p-4">
        {friends.map((friend) => (
          <Friend
            friend={friend}
            key={friend.id}
            onSelection={onSelection}
            selectedFriend={selectedFriend}
          />
        ))}
      </ul>
    </div>
  );
}

function Friend({ friend, onSelection, selectedFriend }) {
  const isSelected = selectedFriend?.id === friend.id;
  return (
    <div>
      <li
        className={
          isSelected
            ? "selected flex p-4 items-center bg-[#f1c89c]"
            : "flex p-4 items-center"
        }
      >
        <img src={friend.image} alt={friend.name} className="rounded-full" />
        <div className="ml-4 w-56">
          <h3 className="font-bold font-serif">{friend.name}</h3>

          {friend.balance < 0 && (
            <p className="red font-serif text-red-600 text-sm">
              You owe {friend.name} {Math.abs(friend.balance)}€
            </p>
          )}
          {friend.balance > 0 && (
            <p className="green font-serif text-green-500 text-sm">
              {friend.name} owes you {Math.abs(friend.balance)}€
            </p>
          )}
          {friend.balance === 0 && (
            <p className="font-serif text-sm">You and {friend.name} are even</p>
          )}
        </div>
        <div className="ml-4">
          <Button onClick={() => onSelection(friend)}>
            {isSelected ? "close" : "select"}
          </Button>
        </div>
      </li>
    </div>
  );
}

function Button({ children, onClick }) {
  return (
    <button
      className="bg-[#ffa94d] text-[#343a40] px-6 py-2 border-4 rounded-lg"
      onClick={onClick}
    >
      {children}
    </button>
  );
}

function FormFriend({ onAddFriend }) {
  const [name, setName] = useState("");
  const [image, setImage] = useState("https://i.pravatar.cc/48");

  function handleSubmit(e) {
    e.preventDefault();

    if (!name || !image) {
      return;
    }
    const id = crypto.randomUUID();
    const newItem = { id, name, image: `${image}?=${id}`, balance: 0 };

    onAddFriend(newItem);
    setName("");
    setImage("https://i.pravatar.cc/48");
  }
  return (
    <form
      className="form-add-friend flex flex-col border-2 mt-4  p-3 space-y-5"
      onSubmit={handleSubmit}
    >
      <label>👫 Friend name</label>
      <input
        type="text"
        className="border-2 p-2"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <label>🌄 Image URL</label>
      <input
        type="text"
        className="border-2 p-2"
        value={image}
        onChange={(e) => setImage(e.target.value)}
      />
      <Button>Add</Button>
    </form>
  );
}

function FormSplittingBill({ selectedFriend, onSplitBill }) {
  console.log(selectedFriend);
  const [bill, setBill] = useState("");
  const [paidByUser, setPaidByUser] = useState("");
  const paidByFriend = bill ? bill - paidByUser : " ";
  const [whoIsPaying, setWhoIsPaying] = useState("user");
  function handleBillSubmit(e) {
    e.preventDefault();
    if (!bill || !paidByUser) {
      return;
    }
    onSplitBill(whoIsPaying === "user" ? paidByFriend : -paidByUser);
  }
  return (
    <form
      className="form-split flex flex-col gap-7 mb-2 p-7 bg-[#f1c89c] text-[#343a40]"
      onSubmit={handleBillSubmit}
    >
      <h2 className="font-bold text-xl font-serif">
        Split a bill with {selectedFriend.name}
      </h2>
      <div className="w-96 flex   justify-between">
        <label className="font-bold text-md">💰 Bill value</label>
        <input
          type="text"
          className="w-44"
          value={bill}
          onChange={(e) => setBill(Number(e.target.value))}
        />
      </div>
      <div className="w-96 flex justify-between">
        <label className="font-bold text-md">🧍‍♀️ Your expense</label>
        <input
          type="text"
          className="w-44"
          value={paidByUser}
          onChange={(e) => setPaidByUser(Number(e.target.value))}
        />
      </div>
      <div className="w-96 flex justify-between">
        <label className="font-bold text-lg">
          👫 {selectedFriend.name} expense
        </label>
        <input type="text" disabled className="w-44" value={paidByFriend} />
      </div>
      <div className="w-96  gap-3 flex justify-between">
        <label className="font-bold text-md">🤑 Who is paying the bill</label>
        <select
          value={whoIsPaying}
          className="w-44"
          onChange={(e) => setWhoIsPaying(e.target.value)}
        >
          <option value="user">you</option>
          <option value="friend">{selectedFriend.name}</option>
        </select>
      </div>
      <Button>Split bill</Button>
    </form>
  );
}
