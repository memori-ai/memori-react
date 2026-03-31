import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { DocumentCard } from './DocumentCard';
import { File } from 'lucide-react';

describe('DocumentCard', () => {
  it('renders title and badge', () => {
    render(
      <DocumentCard
        title="My Document"
        badge="PDF"
        icon={<File />}
      />
    );
    expect(screen.getByText('My Document')).toBeInTheDocument();
    expect(screen.getByText('PDF')).toBeInTheDocument();
  });

  it('applies document and badge classes', () => {
    const { container } = render(
      <DocumentCard
        title="Report"
        badge="DOCX"
        meta="1.2 MB"
        icon={<File />}
      />
    );
    expect(container.querySelector('.memori-media-item--document')).toBeInTheDocument();
    expect(container.querySelector('.memori-media-item--document-title')).toHaveTextContent('Report');
    expect(container.querySelector('.memori-media-item--document-badge')).toHaveTextContent('DOCX');
  });

  it('renders unchanged snapshot', () => {
    const { container } = render(
      <DocumentCard
        title="Spreadsheet"
        badge="XLSX"
        meta="256 KB"
        icon={<File />}
      />
    );
    expect(container).toMatchSnapshot();
  });
});
