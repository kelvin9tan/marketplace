import React, { Component } from 'react';

class Footer extends Component {
    render() {
        let guestFooter = <div className="footer-quest"><p>© 2018 | Prodex s.r.o.</p></div> ;
        return (
            <footer>
                {guestFooter}
            </footer>
        );
    }
}

export default Footer