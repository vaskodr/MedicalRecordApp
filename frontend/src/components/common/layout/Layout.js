import NavigationBar from '../navigation/NavigationBar';

const Layout = ({ children }) => {
    return (
        <div>
            <NavigationBar />
            <main>
                {children}
            </main>
        </div>
    );
};

export default Layout;