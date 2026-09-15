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

  it('applies document and icon classes', () => {
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
    expect(container.querySelector('.memori-media-item--document-icon--docx')).toHaveTextContent('DOCX');
    expect(container.querySelector('.memori-media-item--document-meta')).toHaveTextContent('1.2 MB');
  });

  it('renders icon and meta when provided', () => {
    render(
      <DocumentCard
        title="report.pdf"
        badge="PDF"
        meta="240 KB"
        icon={<File data-testid="doc-icon" />}
      />
    );
    expect(screen.getByText('PDF')).toBeInTheDocument();
    expect(screen.getByText('240 KB')).toBeInTheDocument();
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
