import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import MainLayout from '../components/MainLayout';
import { store } from '../components/store/store';
import { Provider } from 'react-redux';

describe('MainLayout', () => {
  test('renders Navbar and nested route content', () => {
    render(
      <Provider store={store}>
      <MemoryRouter initialEntries={['/test']}>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route path="test" element={<div>Child Content</div>} />
          </Route>
        </Routes>
      </MemoryRouter>
      </Provider>
    );

    
    expect(screen.getByRole('navigation')).toBeInTheDocument();
    
    expect(screen.getByText(/child content/i)).toBeInTheDocument();
  });
});
