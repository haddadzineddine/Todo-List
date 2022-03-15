window.todoStore = {
	todos: JSON.parse(localStorage.getItem("todo-store") || "[]"),
	save() {
		localStorage.setItem("todo-store", JSON.stringify(this.todos));
	},
};

window.Todo = function (body) {
	this.id = Date.now();
	this.body = body;
	this.completed = false;
};

window.todos = function () {
	return {
		...todoStore,
		filter: "all",
		newTodo: "",
		editedTodo: null,

		get active() {
			return this.todos.filter((todo) => !todo.completed);
		},

		get completed() {
			return this.todos.filter((todo) => todo.completed);
		},

		get filteredTodos() {
			return {
				all: this.todos,
				active: this.active,
				completed: this.completed,
			}[this.filter];
		},

		get allCompleted() {
			return (
				this.todos.length != 0 && this.todos.length === this.completed.length
			);
		},

		toggleCompletion(todo) {
			todo.completed = !todo.completed;

			this.save();
		},
		toggleAllCompleted() {
			let allCompleted = this.allCompleted;
			this.todos.map((todo) => (todo.completed = !allCompleted));

			this.save();
		},

		clearCompleted() {
			this.todos = this.active;

			this.save();
		},

		addTodo() {
			if (this.newTodo.trim() == "") return;

			this.todos.push(new Todo(this.newTodo));

			this.newTodo = "";

			this.save();
		},

		deleteTodo(todo) {
			let position = this.todos.indexOf(todo);
			this.todos.splice(position, 1);

			this.save();
		},

		editTodo(todo) {
			todo.cachedBody = todo.body;
			this.editedTodo = todo;
		},

		cancelEdit(todo) {
			todo.body = todo.cachedBody;
			delete todo.cachedBody;
			this.editedTodo = null;
		},

		editComplete(todo) {
			if (todo.body.trim() == "") {
				return this.deleteTodo(todo);
			}
			this.editedTodo = null;

			this.save();
		},

		pluralize(text, len) {
			if (len === 1) {
				return text;
			}

			return text + "s";
		},
	};
};
