import SwiftUI

struct MD3SectionLayout: _VariadicView_MultiViewRoot {
    func body(children: _VariadicView.Children) -> some View {
        VStack(alignment: .leading, spacing: 0) {
            ForEach(children) { child in
                child
                    .padding(.vertical, 14)
                    .padding(.horizontal, 16)
                    // Ensure the content takes full width
                    .frame(maxWidth: .infinity, alignment: .leading)

                if child.id != children.last?.id {
                    Divider()
                        .padding(.leading, 16)
                }
            }
        }
    }
}

struct MD3Section<Header: View, Footer: View, Content: View>: View {
    let header: Header
    let footer: Footer
    let content: Content

    init(
        @ViewBuilder content: () -> Content,
        @ViewBuilder header: () -> Header = { EmptyView() },
        @ViewBuilder footer: () -> Footer = { EmptyView() }
    ) {
        self.header = header()
        self.footer = footer()
        self.content = content()
    }

    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            if !(Header.self == EmptyView.self) {
                header
                    .font(.subheadline)
                    .foregroundColor(.secondary)
                    .padding(.leading, 16)
                    .padding(.top, 8)
            }

            _VariadicView.Tree(MD3SectionLayout()) {
                content
            }
            .frame(maxWidth: .infinity, alignment: .leading)
            .background(Color(uiColor: .secondarySystemGroupedBackground))
            .cornerRadius(24) // Large corner radius like in the VK app image

            if !(Footer.self == EmptyView.self) {
                footer
                    .font(.caption)
                    .foregroundColor(.secondary)
                    .padding(.horizontal, 16)
                    .padding(.bottom, 8)
            }
        }
        .padding(.horizontal, 16)
    }
}

extension MD3Section where Header == Text {
    init(
        _ headerText: String,
        @ViewBuilder content: () -> Content,
        @ViewBuilder footer: () -> Footer = { EmptyView() }
    ) {
        self.init(
            content: content,
            header: { Text(headerText) },
            footer: footer
        )
    }
}

extension MD3Section where Header == Text, Footer == Text {
    init(
        _ headerText: String,
        @ViewBuilder content: () -> Content,
        footerText: String
    ) {
        self.init(
            content: content,
            header: { Text(headerText) },
            footer: { Text(footerText) }
        )
    }
}

extension MD3Section where Header == EmptyView, Footer == Text {
    init(
        @ViewBuilder content: () -> Content,
        footerText: String
    ) {
        self.init(
            content: content,
            header: { EmptyView() },
            footer: { Text(footerText) }
        )
    }
}
