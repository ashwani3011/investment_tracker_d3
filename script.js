const form = document.querySelector("form");
const nameInput = document.querySelector("#name");
const costInput = document.querySelector("#cost");

form.addEventListener("submit", (e) => {
  //will stop page refresh
  e.preventDefault();

  //taking the right input
  if (
    nameInput.value === "" ||
    costInput.value === "" ||
    isNaN(costInput.value)
  ) {
    alert("Please enter correct values!");
  } else {
    let item = { name: nameInput.value, cost: parseInt(costInput.value) };

    db.collection("investment")
      .add(item)
      .then((res) => {
        console.log("Added data");
      });
    // console.log(item);
    // db.collection("investments")
    //   .add(item)
    //   .then((res) => {
    //     nameInput.value = "";
    //     costInput.value = "";
    //   });
  }
});

// console.log(db);
