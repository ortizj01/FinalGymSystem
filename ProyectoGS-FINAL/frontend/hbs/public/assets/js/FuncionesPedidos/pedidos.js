// Agregar + campos para ejercicios

document.addEventListener("DOMContentLoaded", function () {
    let exerciseCounter = 1;

    const addExerciseBtn = document.querySelector(".add-exercise-btn");
    const exerciseList = document.querySelector(".exercise-list");

    addExerciseBtn.addEventListener("click", function () {
        exerciseCounter++;

        const newExerciseContainer = document.createElement("div");
        newExerciseContainer.className = "exercise-container";

        const exerciseField = document.createElement("input");
        exerciseField.type = "text";
        exerciseField.className = "form-control mb-2";
        exerciseField.name = "exercise" + exerciseCounter;
        exerciseField.placeholder = "Ejercicio " + exerciseCounter;

        const deleteExerciseBtn = document.createElement("button");
        deleteExerciseBtn.type = "button";
        deleteExerciseBtn.className = "btn btn-danger delete-exercise-btn";
        deleteExerciseBtn.textContent = "Eliminar";
        deleteExerciseBtn.addEventListener("click", function () {
            exerciseList.removeChild(newExerciseContainer);
        });

        newExerciseContainer.appendChild(exerciseField);
        newExerciseContainer.appendChild(deleteExerciseBtn);
        exerciseList.insertBefore(newExerciseContainer, addExerciseBtn);
    });
});



