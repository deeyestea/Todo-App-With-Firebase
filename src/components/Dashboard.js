import React, { Component } from 'react';
import { usersTasklist, firebaseApp } from '../Firebase'

class Dashboard extends Component {

    constructor(props) {
        super(props);
        this.state = {
            tasklist: '',
            status: '',
            assign: '',
            completeTasklist: [],
        }
    }

    removeTasklist = (index) => {
        const { userid } = this.props;
        const thisUser = usersTasklist.child(userid);
        let completeTasklist = this.state.completeTasklist.slice();
        completeTasklist.splice(index, 1)
        this.setState({ completeTasklist: completeTasklist })
        thisUser.set({ completeTasklist });
    }

    addTasklist = () => {
        const { userid } = this.props;
        const thisUser = usersTasklist.child(userid);
        const { tasklist, status, assign } = this.state;
        const { completeTasklist } = this.state;
        completeTasklist.push([tasklist, status, assign]);
        this.setState({ completeTasklist: completeTasklist })
        thisUser.set({ completeTasklist });
    }

    // updateTasklist = (index) => {
    //     const { userid } = this.props;
    //     const thisUser = usersTasklist.child(userid);
    //     let completeTasklist = this.state.completeTasklist.slice(index);
    //     thisUser.update({ completeTasklist: completeTasklist });
    //     console.log(completeTasklist)
    // }


    // const todoList = this.state.completeTasklist.map((item, index) => {
    //     return (
    //         <table className="table table-hover">
    //             <thead>
    //                 <tr>
    //                     <td>Task</td>
    //                     <td>Status</td>
    //                     <td>Actions</td>
    //                 </tr>
    //             </thead>
    //             <tbody>
    //                 <tr>
    //                     <td>{item[0]}</td>
    //                     <td>{item[1]}</td>
    //                     <td><button className="btn btn-danger" style={{ float: 'right', borderRadius: '10px' }}
    //                         onClick={this.removeTasklist.bind(this, index)} > Delete
    //                     </button></td>
    //                 </tr>
    //             </tbody>
    //         </table>
    //     )
    // })

    // getUsers() {
    //     admin
    //         .auth()
    //         .getUser(uid)
    //         .then((userRecord) => {
    //             // See the UserRecord reference doc for the contents of userRecord.
    //             console.log(`Successfully fetched user data: ${userRecord.toJSON()}`);
    //         })
    //         .catch((error) => {
    //             console.log('Error fetching user data:', error);
    //         });
    // }

    // console.log(getusers());

    todoList() {
        return (
            <table className="table table-hover">
                <thead>
                    <tr>
                        <td>Task</td>
                        <td>Status</td>
                        <td>Assign to</td>
                        <td>Actions</td>
                    </tr>
                </thead>
                <tbody>
                    {this.state.completeTasklist.length === 0 ? "Task list is empty..." :
                        (
                            this.state.completeTasklist.map((task, index) => {
                                return (
                                    <tr key={index}>
                                        <td>{task[0]}</td>
                                        <td>{task[1]}</td>
                                        <td>{task[2]}</td>
                                        <td><button className="btn btn-danger" style={{ float: 'right', borderRadius: '10px' }}
                                            onClick={this.removeTasklist.bind(this, index)} > Delete
                                        </button>
                                            <button className="btn btn-primary"
                                                style={{ float: 'right', borderRadius: '10px', marginRight: '10px' }}
                                            > Edit</button>
                                        </td>
                                    </tr>
                                )
                            })
                        )
                    }
                </tbody>
            </table>
        )
    }

    // getAllUsers() {
    //     const users = firebaseApp.database().ref('/users/')
    //     users.on('value', (snapshot) => {
    //         snapshot.forEach((user) => {
    //             console.log(user.key)
    //             firebaseApp.database().ref('/users/' + user.key).on('value', (snapshot) => {
    //                 const user = snapshot.val()
    //                 const { completeTasklist } = this.status
    //                 const newusers = [...completeTasklist, user.key]
    //                 this.setState({ newusers: newusers })
    //             })
    //         })
    //     })
    // }

    // listAllUsers(nextPageToken) {
    //     admin.auth()
    //         .listUsers(1000, nextPageToken)
    //         .then((listUsersResult) => {
    //             listUsersResult.users.forEach((userRecord) => {
    //                 console.log('user', userRecord.toJSON());
    //             });
    //             if (listUsersResult.pageToken) {
    //                 listAllUsers(listUsersResult.pageToken);
    //             }
    //         })
    //         .catch((error) => {
    //             console.log('Error listing users:', error);
    //         });
    // };

    getAllUsers() {
        firebaseApp
            .database()
            .ref('usersTasklist')
            .once('value', snap => {
                console.log(snap.val())
            });
    }

    renderTasklist() {
        return this.todoList()
    }


    componentDidMount() {
        const { userid } = this.props;
        const thisUser = usersTasklist.child(userid);
        thisUser.on('value', (snap, i) => {
            snap.forEach((d, i) => this.setState({ completeTasklist: d.val() }))
        })
    }

    render() {
        console.log(this.state)
        return (
            <div className="container" style={{ margin: '100px' }}>
                <div className="row">
                    <div className="col-md-4">
                        <div className="form-group">
                            <input className="form-control" placeholder="Enter your task here..."
                                onChange={({ target }) => this.setState({ tasklist: target.value })} />
                            <select id="status" name="status"
                                onChange={e => this.setState({
                                    status: e.target.value
                                })}>
                                <option value="" disabled selected>----Status----</option>
                                <option value="todo">TODO</option>
                                <option value="doing">DOING</option>
                                <option value="done">DONE</option>
                            </select>
                            <select id="assign" name="assign"
                                onChange={e => this.setState({ assign: e.target.value })}>
                                <option value="" disabled selected>----Assign to others----</option>
                                <option value="assign-to">{this.getAllUsers()}</option>
                            </select>
                            <div className="center">
                                <button className="btn btn-primary btn-block" style={{ margin: '15px', borderRadius: '10px' }}
                                    onClick={this.addTasklist}> Add Task </button>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-7 ml-5">
                        <h2 style={{ marginBottom: '50px' }}>Your task list.</h2>
                        <ul className="list-group">
                            {this.renderTasklist()}
                        </ul>
                    </div>
                </div>
            </div>
        )
    }
}

export default Dashboard;