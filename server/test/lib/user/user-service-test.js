import userService from '../../../lib/user/user-service';

userService.validateUser({
    name: 'Pliman',
    pass: 'reserved'
}).then((result) => {
    console.log(result);
});
