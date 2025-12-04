const handleReady = (client) => {
  console.log(`Logged in as ${client.user.tag}`);
};

module.exports = { handleReady };

