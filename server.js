const express = require('express');
const bodyParser = require('body-parser');
const csurf = require('csurf');
const cookieParser = require('cookie-parser');

const PORT = process.env.PORT || 3000;
const app = express();

const csrfMiddleware = csurf({
    cookie: true
});

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(cookieParser());
app.use(csrfMiddleware);

app.get('/', (req, res) => {
    res.send(`
    <h1>Registration</h1>
<form>
    <div>
        <label for="message">Username</label>
        <input id="message" name="message" type="text" />
        <label for="pw">Password</label>
        <input id="pw" name="pw" type="text" />
        <input type="button" value="Submit" onclick="onSubmitClick()" />
    </div>
    <div>
        <input id="csrf_tocken" type="hidden" name="_csrf" value="${req.csrfToken()}" />
    </div>
</form>
<script type="text/javascript" src="http://code.jquery.com/jquery-1.7.1.min.js"></script>
<script type="text/javascript">
    function onSubmitClick() {
        var data = {
            username: document.getElementById("message").value,
            password: document.getElementById("pw").value
        }
        var csrfTocken = document.getElementById("csrf_tocken").value;
        $.ajax({
            url: 'http://localhost:3000/entry',
            dataType: 'text',
            type: 'post',
            data: data,
            headers: {
                'X-CSRF-Token': csrfTocken
            },
            success: function (data, textStatus, jQxhr) {
                console.log('errorThrown');
            },
            error: function (jqXhr, textStatus, errorThrown) {
                console.log(errorThrown);
            }
        });
    }
</script>`
    );
});

app.post('/entry', (req, res) => {
    if (req.body.username == 'admin' && req.body.password == '123') {
        console.log('Authenticate successfull');
        res.send(`CSRF token used: ${req.cookies._csrf}, Message received: ${req.body.username}`);
    }
    else {
        console.log('Authentication failed');
        res.send(`CSRF token used: ${req.cookies._csrf}, Message received: ${req.body.message}`);
    }
});

app.listen(PORT, () => {
    console.log(`Listening on http://localhost:${PORT}`);
});