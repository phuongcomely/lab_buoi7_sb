const API_URL = "http://localhost:8080/todos";

//đầu tiên lấy dữ liệu từ server
//lấy từng chi tiết trong dữ liệu

const getAllTodos = async () => { //sử dụng axios
    try {
        let res = await axios.get(API_URL); //lấy dữ liệu trên server 
        console.log(res);

        renderTodo(res.data);
    } catch (error) {
        console.log(error);
    }
};

// Hiển thị ds công việc
const todoListEl = document.getElementById("todolist");
const renderTodo = (todos) => {
    let html = "";
    todos.forEach((todo) => {
        //thực hiện quá trình render //onchange: thay đổi nội dung trong ô input, edit, delete: các hàm sử lý sự kiện
        html += `
            <li>
                <input type="checkbox" ${todo.completed ? 'checked' : ''} 
                    onchange="toggleCompleted(${todo.id})"> 
                <span class="${todo.completed ? 'active' : ''}">${todo.title}</span>
                <button onclick="editTodo(${todo.id})">Sửa</button>
                <button onclick="deleteTodo(${todo.id})">Xóa</button>
            </li>
        `;
    });
    todoListEl.innerHTML = html;
};

// Thêm công việc
const todoInputEl = document.getElementById("todo-input");
const btnAdd = document.getElementById("btn-add");

btnAdd.addEventListener("click", async () => {
    // Lấy ra nd trong input
    const title = todoInputEl.value.trim(); //(.trim là loại bỏ khoảng trắng đầu cuối)

    // Kiểm tra nd có rỗng hay không
    if (title === "") {
        alert("Vui lòng nhập nội dung công việc"); //(alert: hiển thị ra màn hình )
        return;
    }

    // Gọi API
    try {
        //tạo object -> post 
        const newTodo = {
            title: title,
            completed: false
        }

        let res = await axios.post(API_URL, newTodo);
        console.log(res);

        // Hiển thị lại ds công việc
        // C1: Gọi lại API lấy ds công việc (renderTodo)
        // C2: Reload lại trang
        // C3: Tạo thêm 1 li mới và append vào ul(hay còn gọi append vào dom)
    } catch (error) {
        console.log(error);
    }
});

// Xóa công việc
const deleteTodo = async (id) => {
    try {
        // Gọi API để xóa trên server
        await axios.delete(`${API_URL}/${id}`);

        // Xóa cv trên giao diện
        // C1: Gọi lại API lấy ds công việc
        // C2: Reload lại trang
        // C3: Xóa li chưa todo tương ứng trong ul
    } catch (error) {
        console.log(error);
    }
}

// Sửa tiêu đề công việc
const editTodo = async (id) => {
    try {
        // Tìm kiếm cv cần sửa
        let res = await axios.get(`${API_URL}/${id}`);//lấy ra id công việc
        let currentTodo = res.data;

        // Sử dụng window.prompt để hiển thị popup nhập nội dung mới
        let newTitle = window.prompt("Nhập nội dung mới", currentTodo.title);

        // Kiểm tra nội dung mới có rỗng hay không
        if (newTitle === null) return;
        if (newTitle === "") {
            alert("Vui lòng nhập nội dung công việc");
            return;
        }

        // Sửa tiêu đề
        currentTodo.title = newTitle;

        // Gọi API để sửa trên server
        await axios.put(`${API_URL}/${id}`, currentTodo);

        // Update cv trên giao diện
        // C1: Gọi lại API lấy ds công việc
        // C2: Reload lại trang
        // C3: Tìm li chứa todo tương ứng trong ul và update lại tiêu đề
    } catch (error) {
        console.log(error);
    }
    
}

// Sửa trạng thái công việc
const toggleCompleted = async (id) => {
    try {
        // Tìm kiếm cv cần sửa
        let res = await axios.get(`${API_URL}/${id}`); //lấy api
        let currentTodo = res.data;

        // Sửa trạng thái
        currentTodo.completed = !currentTodo.completed; //sử dụng phủ định false true

        // Gọi API để sửa trên server
        await axios.put(`${API_URL}/${id}`, currentTodo); //cần có id của công việc, và dữ liệu gửi lên để sửa 

        // Update cv trên giao diện
        // C1: Gọi lại API lấy ds công việc
        // C2: Reload lại trang
        // C3: Tìm li chứa todo tương ứng trong ul và update lại trạng thái
    } catch (error) {
        console.log(error);
    }
}

getAllTodos();

//tìm kiếm công việc 
const todoSearchEl = document.getElementById('todo-search');
const btnSearch = document.getElementById('btn-search');

btnSearch.addEventListener('click', async() =>{
    const titleSearch = todoSearchEl.value.trim();

    if(titleSearch===""){
        alert('Nội dung tìm kiếm trống');
        return;
    }
    try {
        let res = await axios.get(`${API_URL}?title_like=${titleSearch}`);
        let searchResults = res.data; //lấy kết quả vừa get
        renderTodo(searchResults);
       

        
    } catch (error) {
        console.log(error);
    }
});
//sử lý sự kiện button "hiển thị all danh sách"
const btnShowTodo = document.getElementById("btn_showTodo");
btnShowTodo.addEventListener('click', async()=>{
    getAllTodos();
    todoSearchEl.value = null;
})