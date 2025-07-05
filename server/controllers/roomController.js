export const allPlayers = [
  "Virat Kohli", "Rohit Sharma", "Jasprit Bumrah", "Rishabh Pant", "Hardik Pandya",
  "KL Rahul", "Shubman Gill", "Suryakumar Yadav", "Yuzvendra Chahal", "Ravindra Jadeja",
  "Mohammed Shami", "Shreyas Iyer", "Axar Patel", "Ishan Kishan", "Prithvi Shaw"
];

export const getRoomKey = (roomId) => `room:${roomId}`;

export const initializeRoom = () => ({
  playersPool: [...allPlayers],
  users: [],
  selections: {},
  turnOrder: [],
  currentTurnIndex: 0,
  started: false,
});
