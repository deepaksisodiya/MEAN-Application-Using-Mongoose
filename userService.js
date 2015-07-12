/**
 * Created by deepak on 21/06/15.
 */

app.factory('userService', function($resource) {
    var data = $resource('/users/:userId', {userId : '@_id'}, {
        update : {
            method : 'PUT'
        }
    });
    return data;
});