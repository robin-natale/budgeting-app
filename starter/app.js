/*
TO DO LIST:
-Event handler
-Get input value
-Add the new item to our data
-Add the new item to the UI
-Calculate budget
-Update budget in UI
*/

/* 
Modules:allow us to break our code into logic parts(modules) that interact with each other.
Modules are:
-Important aspect of any robust application's architecture
-Keep units of code for a project cleanly separated and organised
-Encapsulate some data into privacy and expose other data publicly
*/

//User interface module , data mobule , controller module

/*
Data incapsulation allow us to hide the implementation detail of a specific module from the outside scope, so we only expose a public interface (API)
*/

//Separation of concerns: each module of the application is interested in doing one thing independently

/*-------DATA MODULE--------*/

//data privacy with IIFE
var budgetController = (function(){
/*
    var x = 23;

    var add = function(a){
        return x + a;
    }

    //The secret of the module pattern is that return an object containing all of the functions that we want to be public (giving access to outside scope)
    return {
        //add method to pass value from the public function ( public test() ) to the private function ( add() )
        publicTest: function(b){
            return add(b);
        }
    }
*/

    //Data model for income or expenses (function constructor for each one of them)

    var Expense = function (id, description, value){
        this.id = id;
        this.description = description;
        this.value = value;
    };

    var Income = function (id, description, value){
        this.id = id;
        this.description = description;
        this.value = value;
    };

    var calculateTotal = function(type){
        var sum = 0;
        //The for each array is a function that as parameters can access to:current value, current index, complete array
        data.allItems[type].forEach(function(cur){
            sum = sum + cur.value;
        });
        data.total[type] = sum;
    };

    //Data structure:it's best to put all the data together in arrays that are stored within objects(this way the code is cleaner and easier to access)
    var data = {
        allItems:{
            exp:[],
            inc:[]
        },
        total:{
            exp: 0,
            inc:0
        },
        budget:0,
        percentage:-1//-1 is usually usually to say that it doesn;t exsist yet
    }

    return {
        addItem: function (type, des, val) {
            var newItem , ID;

            //Id == last ID + 1
            //Create new ID
            if (data.allItems[type].length > 0){
                ID = data.allItems[type][data.allItems[type].length -1].id + 1;
            } else {
                ID = 0;
            }
            
            //Create new item based on 'inc' or 'exp' type
            if(type === 'exp'){
                newItem = new Expense(ID, des, val);
            } else if (type === 'inc'){
                newItem = new Income(ID, des, val);
            }
            
            //Push it into our data structure
            data.allItems[type].push(newItem);

            //Return the new element
            return newItem;
        },

        deleteItem: function(type, id){
            var ids, index;
            //Map method: loop through the array, receives a function that has access to the current elemenet,current index and entire array
            //Map method also returns a new array
            ids = data.allItems[type].map(function(current){
                return current.id;
            });
            //Find the index of our id
            index = ids.indexOf(id);
            //Delete the id
            if(index !== -1){
                //Splice method: is used to remove element. The first argument is where the method will start to remove element, the second argument is how many elements we want to delete
                data.allItems[type].splice(index, 1);
            }
        },

        calculateBudget: function(){
            //Calculare total income and expenses
            calculateTotal('exp');
            calculateTotal('inc');

            //Calculate the budget: income - expenses
            data.budget = data.total.inc - data.total.exp;

            //Calculate the percentage of income that we spent
            if(data.total.inc >0){
                data.percentage = Math.round((data.total.exp / data.total.inc) * 100);
            }else{
                data.percentage = -1;
            }
        },
        getBudget:function(){
            return {
                budget: data.budget,
                totalInc: data.total.inc,
                totalExp: data.total.exp,
                percentage: data.percentage
            };
        },
        testing: function() {
            console.log(data);

        }
    }

})();

/*-------UI MODULE--------*/

//data privacy with IIFE
var UIController = (function(){
     
    var DOMstrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn',
        incomeContainer: '.income__list',
        expensesContainer: '.expenses__list',
        budgetLabel: '.budget__value',
        incomeLabel: '.budget__income--value',
        expenseLabel: '.budget__expenses--value',
        percentageLabel: '.budget__expenses--percentage',
        container: '.container'
    };

    return {
        getInput: function(){
            return{
            type: document.querySelector(DOMstrings.inputType).value, // will be inc or exp
            description: document.querySelector(DOMstrings.inputDescription).value,
            value: parseFloat(document.querySelector(DOMstrings.inputValue).value)//parseFloat convert a string to a (floating number)decimal number          
            };
        },

        addListItem: function (object,type) {
            var html, newHtml, element;

            //Create html string with placeholder text
            
            if(type === 'inc'){
                element = DOMstrings.incomeContainer;
                html = '<div class="item clearfix" id="inc-%id%"> <div class="item__description">%description%</div> <div class="right clearfix"> <div class="item__value">%value%</div> <div class="item__delete"> <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button> </div></div></div>';
            } else if (type === 'exp'){
                element = DOMstrings.expensesContainer;
                html ='<div class="item clearfix" id="exp-%id%"> <div class="item__description">%description%</div> <div class="right clearfix"> <div class="item__value">%value%</div> <div class="item__percentage">21%</div> <div class="item__delete"> <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button> </div> </div> </div>';
            }

            //Replace placeholder text with data
            //Replace method is a string method. It replaces the data currently in our string and replaces it with the data that we call from the new method
            newHtml = html.replace('%id%', object.id);
            newHtml = newHtml.replace('%description%', object.description);
            newHtml = newHtml.replace('%value%', object.value);
            
            //Insert the html into DOM
            //insert json html method
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
        },

        clearFields: function () {
            var fields, fieldsArray;
            fields = document.querySelectorAll(DOMstrings.inputDescription + ',' + DOMstrings.inputValue);
            
            //Use the slice method or the array prototype to return items in an array rather than a list
            fieldsArray = Array.prototype.slice.call(fields);

            //Foreach method to loop over all element of the array and clear the value of the element(description and value)
            fieldsArray.forEach(function(current, index, array) {
                current.value = "";
            });

            //Set focus on first element of array
            fieldsArray[0].focus();
        },

        displayBudget: function(obj){
            document.querySelector(DOMstrings.budgetLabel).textContent = obj.budget;
            document.querySelector(DOMstrings.incomeLabel).textContent = obj.totalInc;
            document.querySelector(DOMstrings.expenseLabel).textContent = obj.totalExp;
            
            if(obj.percentage>0){
                document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage + '%';
            }else{
                document.querySelector(DOMstrings.percentageLabel).textContent = '---';
            }
        },

        getDOMstrings: function() {
            return DOMstrings;
        }
    };

})();


/*-------APP CONTROLLER MODULE--------*/

//data privacy with IIFE passing other variables module as arguments
var controller = (function(budgetCtrl, UICtrl) {
    
    /*
    var z = budgetCtrl.publicTest(5);

    //We create a public method to access to the variables in the IIFE function
    return{
        anotherPublic : function(){
            console.log(z);
        }
    }*/

    var setUpEventListeners = function(){

        var DOM = UICtrl.getDOMstrings();

        //Event listener
        document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);
            

        //Event listener with keypress(when hits the return key)
        document.addEventListener('keypress', function(event){

            //keycode is a property of keypress and gives a code to any key pressed (new browser)
            //keycode is a property of keypress and gives a code to any key pressed (old browser)
            if(event.keyCode === 13 || event.which === 13 ){
                ctrlAddItem();
            }
        });

        //Event handler for delete items: We will create an event delegation so we can target a parent element and also because those elements are not yet in our app 
        document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);
    };

    var updateBudget = function(){

        // 1. Calculate the budget 
        budgetCtrl.calculateBudget();

        // 2. Return the budget
        var budget = budgetCtrl.getBudget();

        // 3. Display budget on UI
        UICtrl.displayBudget(budget);

    };


    var ctrlAddItem = function(){
        var input, newItem;

        // 1. Get the field input data
        input = UICtrl.getInput();

        if(input.description !== "" && !isNaN(input.value) && input.value > 0){
            // 2. Add the item to the budget controller
            newItem = budgetCtrl.addItem(input.type, input.description, input.value);

            // 3. Add new item to the UI
            UICtrl.addListItem(newItem , input.type);

            //4. Clear fields
            UICtrl.clearFields();

            // 5. Calculate and update budget
            updateBudget();
        }    

    };


    var ctrlDeleteItem = function(event){
        //We need to put an argument as parameter so we know what the target element of out function is.
        //DOM Treversing: by using .parentNode we can walk up the parents element in html
        var itemID, splitID, type, ID;
        console.log(event.target.parentNode.parentNode.parentNode.parentNode.id);

        if(itemID){
            //Split method is a string method that devides our element in two from the detirmined element in ('')
                splitID = itemID.split('-');
                type = splitID[0];
                //parseInt method convert a string into a intiger number
                ID = parseInt(splitID[1]);

                // 1. Delete item from the data structure
                budgetCtrl.deleteItem(type, ID);
                
                // 2. Delete item from UI

                // 3. Update and show the new budget
        }

    };


    //Because we inserted all our event listener in a function, we need to call this functiin. So we return it in an object, and call it outside the IIFE 
    return {
        init: function(){
            //Display budget set to 0
            UICtrl.displayBudget({
                budget: 0,
                totalInc: 0,
                totalExp: 0,
                percentage: -1
            });
            setUpEventListeners();
        }
    }

})(budgetController, UIController);


controller.init();
