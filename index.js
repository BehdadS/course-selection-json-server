class CourseView {
  constructor() {
    this.allCourses = document.getElementsByClassName('course');
    this.courseInput = document.querySelector("#newCourse");
    this.addBtn = document.querySelector("course__actions--add");
    this.courseList = document.querySelector(".courseList");
    this.selectedList = document.querySelector(".selectedList");
  }
  
  select(courses){
    let selectedCourses = 0
    courses.forEach((course) => {
      console.log(this.allCourses(1))
      selectedCourses += course.credit
      console.log(selectedCourses)
    });
  }

  selectCourse(courses){
    let selectedCourses = 0
    document.querySelector(".courseList").addEventListener('click', (e) => {
      const target = e.target;
      if(target.classList.contains('clicked')){
        target.classList.add("unclicked")
        target.classList.remove("clicked")
        selectedCourses -= courses[target.id-1].credit
      } else
        target.classList.add("clicked")
      if(target.classList.contains('clicked')){
        selectedCourses += courses[target.id-1].credit
        if (selectedCourses > 18){
          target.classList.remove('clicked')
          selectedCourses -= courses[target.id-1].credit
          alert("You are not able to select more than 18 credits!!");
        }
      }
      if(target.classList.contains('unclicked')){
      }
      document.getElementById('credits').innerText = selectedCourses
    })

    document.querySelector("#select").addEventListener('click', (e) => {
      const chosenCourses = document.getElementsByClassName("clicked")
      const selectedCourses = document.getElementById("selectedList")
      selectedCourses.innerHTML = ""
      for(let i = 0 ; i < chosenCourses.length ; i++){
        const element = (chosenCourses.item(i))
        selectedCourses.innerHTML += "<div class='course'>" + element.innerHTML + "</div>"
      }
    })
  }

  renderCourses(courses) {
    courses.forEach((course) => {
      const courseElem = this.createCourseElement(course);
      this.courseList.appendChild(courseElem);
    });

  }

  appendCourse(newCourse) {
    const courseElem = this.createCourseElement(newCourse);
    this.courseList.appendChild(courseElem);
  }

  createCourseElement(course) {
    const courseElem = document.createElement("div");
    courseElem.classList.add("course");
    courseElem.setAttribute("id", course.courseId)
    const courseTitle = document.createElement("p");
    courseTitle.classList.add("courseName");
    courseTitle.innerText = course.courseName;
    const courseType = document.createElement("p");
    courseType.classList.add("courseType");
    if(course.required){
      courseType.innerText = "Course Type : Compulsory";
    } else {
      courseType.innerText = "Course Type : Elective";
    }
    const courseCredit = document.createElement("p");
    courseCredit.classList.add("courseCredit");
    courseCredit.innerText = "Course Credit : " + course.credit;
    const courseActions = document.createElement("div");
    courseActions.classList.add("course__actions");

    courseElem.appendChild(courseTitle);
    courseElem.appendChild(courseType);
    courseElem.appendChild(courseCredit);
    courseElem.appendChild(courseActions);

    return courseElem;
  }
}

class CourseModel {
  #courses;
  constructor() {
    this.#courses = [];
  }

  async fetchCourses() {
    const courses = await API.getCourses();
    this.courses = courses;
    return courses;
  }

  async addCourse(newCourse) {
    const course = await API.postCourse(newCourse);
    this.#courses.push(course);
    return course;
  }

  async deleteCourseById(id){
    await API.deleteCourse(id);
  }
}

class CourseConroller {
  constructor(model, view) {
    this.model = model;
    this.view = view;
    this.init();
  }

  init() {
    this.model.fetchCourses().then(() => {
      const courses = this.model.courses;
      this.view.selectCourse(courses);
      this.view.renderCourses(courses);
    });
  }
}

const app = new CourseConroller(new CourseModel(), new CourseView());