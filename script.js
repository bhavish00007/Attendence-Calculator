let subjects = [];

const subjectNameInput = document.getElementById('subject-name');
const totalClassesInput = document.getElementById('total-classes');
const attendedClassesInput = document.getElementById('attended-classes');
const addSubjectBtn = document.getElementById('add-subject');
const subjectTable = document.getElementById('subject-table');
const ctx = document.getElementById('attendanceChart').getContext('2d');

let attendanceChart;

addSubjectBtn.addEventListener('click', () => {
    const name = subjectNameInput.value.trim();
    const total = parseInt(totalClassesInput.value);
    const attended = parseInt(attendedClassesInput.value);

    if(name && total >=0 && attended >=0 && attended <= total){
        subjects.push({name, total, attended});
        subjectNameInput.value = '';
        totalClassesInput.value = '';
        attendedClassesInput.value = '';
        renderTable();
    } else {
        alert("Please enter valid data. Attended cannot be more than total.");
    }
});

function renderTable(){
    subjectTable.innerHTML = '';
    subjects.forEach((sub, index) => {
        const attendancePercent = ((sub.attended / sub.total) * 100).toFixed(2);
        const safeBunks = Math.floor((sub.attended - 75/100*sub.total)/(75/100)) >=0 ? Math.floor((sub.attended - 0.75*sub.total)/(0.75)) : 0;

        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${sub.name}</td>
            <td>${sub.total}</td>
            <td>${sub.attended}</td>
            <td>${attendancePercent}%</td>
            <td>${safeBunks}</td>
            <td><button class="delete-btn" onclick="deleteSubject(${index})">Delete</button></td>
        `;
        subjectTable.appendChild(tr);
    });
    renderChart();
}

function deleteSubject(index){
    subjects.splice(index,1);
    renderTable();
}

function renderChart(){
    const labels = subjects.map(s => s.name);
    const data = subjects.map(s => ((s.attended / s.total)*100).toFixed(2));

    if(attendanceChart) attendanceChart.destroy();

    attendanceChart = new Chart(ctx,{
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Attendance %',
                data: data,
                backgroundColor: '#4facfe'
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: { beginAtZero:true, max:100 }
            }
        }
    });
}
