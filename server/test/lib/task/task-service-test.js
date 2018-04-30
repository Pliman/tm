import taskService from '../../../lib/task/task-service';

// taskService.createTask({
//     uid: '5ae5cda1a5442c046af6ad21',
//     name: '项目项目3',
//     desc: '项目项目3',
//     estimatedtime: '4 12:00:00',
//     status: 0
// }).then(function (r) {
//     console.log(r);
// });

// taskService.startTask('5ae6c4890e6d9b0f831bc81d').then((r) => {
//     console.log(r);
// }, (e) => {
//     console.log(e);
// });

// taskService.completeTask('5ae6c47f0f985c0f7f8618e9').then((r) => {
//     console.log(r);
// }, (e) => {
//     console.log(e);
// });

// taskService.getUndoneTasks().then((r) => {
//     console.log(r);
// }, (e) => {
//     console.log(e);
// });

taskService.getRecent3MonthDoneTasks().then((r) => {
    console.log(r);
}, (e) => {
    console.log(e);
});
