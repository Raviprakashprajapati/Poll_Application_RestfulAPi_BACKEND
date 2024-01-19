CREATE TABLE Polls (
  pollId INT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(255) NOT NULL,
  category VARCHAR(255),
  startDate DATE,
  endDate DATE,
  minReward INT,
  maxReward INT
);

 fieldCount: 0,
  affectedRows: 1,
  insertId: 1,
  serverStatus: 2,
  warningCount: 0,
  message: '',
  protocol41: true,
  changedRows: 0

CREATE TABLE Questions (
  questionId INT PRIMARY KEY,
  pollId INT,
  questionType VARCHAR(20) CHECK (questionType IN ('single', 'multiple')),
  questionText TEXT,
  FOREIGN KEY (pollId) REFERENCES Polls(pollId)
);

CREATE TABLE Options (
  optionId INT PRIMARY KEY,
  questionId INT,
  optionText VARCHAR(255),
  FOREIGN KEY (questionId) REFERENCES Questions(questionId)
);

CREATE TABLE Users (
  userId INT PRIMARY KEY,
  username VARCHAR(255) NOT NULL
);

CREATE TABLE UserResponses (
  responseId INT PRIMARY KEY,
  userId INT,
  pollId INT,
  questionId INT,
  chosenOptions TEXT,
  FOREIGN KEY (userId) REFERENCES Users(userId),
  FOREIGN KEY (pollId) REFERENCES Polls(pollId),
  FOREIGN KEY (questionId) REFERENCES Questions(questionId)
);

CREATE TABLE PollAnalytics (
  analyticsId INT PRIMARY KEY,
  pollId INT,
  totalVotes INT,
  optionCounts JSON,
  FOREIGN KEY (pollId) REFERENCES Polls(pollId)
);

