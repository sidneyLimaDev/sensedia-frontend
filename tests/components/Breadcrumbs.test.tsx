/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { render, screen } from '@testing-library/react';
import { Breadcrumbs } from '@/app/components/Breadcrumbs';
import '@testing-library/jest-dom';

jest.mock('next/navigation', () => ({
    usePathname: jest.fn(),
}));

jest.mock('next/image', () => ({
    __esModule: true,
    default: (props: any) => {
        return <img {...props} />;
    },
}));

jest.mock('next/link', () => {
    return function Link({ children, ...props }: { children: React.ReactNode;[key: string]: any }) {
        return <a {...props}>{children}</a>;
    };
});

jest.mock('@/assets/Polygon.svg', () => ({
    src: '/mock-polygon.svg',
    height: 6,
    width: 6,
}));
import { usePathname } from 'next/navigation';
describe('Componente Breadcrumbs', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    it('deve renderizar corretamente com um único segmento de caminho', () => {
        (usePathname as jest.Mock).mockReturnValue('/user');
        render(<Breadcrumbs />);

        expect(screen.getByText('user')).toBeInTheDocument();
    });
    it('deve renderizar corretamente com múltiplos segmentos de caminho', () => {
        (usePathname as jest.Mock).mockReturnValue('/user/new');
        render(<Breadcrumbs />);
        expect(screen.getByText('user')).toBeInTheDocument();
        expect(screen.getByText('new')).toBeInTheDocument();
        const userLink = screen.getByRole('link', { name: 'user' });
        expect(userLink).toHaveAttribute('href', '/user');
        expect(screen.queryByRole('link', { name: 'new' })).not.toBeInTheDocument();
    });
    it('deve renderizar corretamente com um parâmetro dinâmico de ID', () => {
        (usePathname as jest.Mock).mockReturnValue('/user/123456');
        render(<Breadcrumbs />);
        expect(screen.getByText('user')).toBeInTheDocument();
        expect(screen.getByText('123456')).toBeInTheDocument();
        const userLink = screen.getByRole('link', { name: 'user' });
        expect(userLink).toHaveAttribute('href', '/user');
        expect(screen.queryByRole('link', { name: '123456' })).not.toBeInTheDocument();
    });
    it('deve corresponder ao snapshot', () => {
        (usePathname as jest.Mock).mockReturnValue('/user/form/novo');
        const { container } = render(<Breadcrumbs />);
        expect(container).toMatchSnapshot();
    });
});