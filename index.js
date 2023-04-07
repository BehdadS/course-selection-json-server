class CourseView {
  constructor() {
    this.allCourses = document.getElementsByClassName('course');
    this.courseInput = document.querySelector("#newCourse");
    this.addBtn = document.querySelector("course__actions--add");
    this.courseList = document.querySelector(".courseList");
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
    courseElem.setAttribute("course-id", course.courseId)
    courseElem.setAttribute("onclick", 'classList.toggle("clicked")')
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

  

  removeCourseFromView(id){
    const courseToRemove = document.querySelector(`[course-id="${id}"]`);
    courseToRemove.remove();
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
      this.view.renderCourses(courses);
    });
    this.setUpAddCourse();
    this.setUpRemoveCourse();
  }

  setUpAddCourse() {
    if(this.view.allCourses){
      console.log(this.view.allCourses)
      this.view.allCourses.addEventListener('click', function (event) {
        console.log("asds")
      });
    }
    
    
  }
  
  setUpRemoveCourse(){
      this.view.courseList.addEventListener('click', (e) => {
        const target = e.target;
        if(target.classList.contains('course__actions--delete')){
          target.setAttribute("disabled","true");
          const idToRemove = target.getAttribute('remove-id');
          this.model.deleteCourseById(idToRemove).then(()=>{
            this.view.removeCourseFromView(idToRemove)
          }).catch((err)=>{
            console.log(err);
            target.removeAttribute("disabled")
          })
        }
      })
  }

}

const app = new CourseConroller(new CourseModel(), new CourseView());
