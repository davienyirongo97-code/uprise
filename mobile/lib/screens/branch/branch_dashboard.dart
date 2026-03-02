import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../providers/auth_provider.dart';
import 'register_client_screen.dart';
import 'loan_application_screen.dart';

class BranchDashboard extends StatelessWidget {
  const BranchDashboard({super.key});

  @override
  Widget build(BuildContext context) {
    final auth = context.watch<AuthProvider>();

    return Scaffold(
      appBar: AppBar(
        title: const Text('Branch Dashboard'),
        actions: [
          IconButton(
            icon: const Icon(Icons.logout),
            onPressed: () => auth.logout(),
          ),
        ],
      ),
      body: GridView.count(
        crossAxisCount: 2,
        padding: const EdgeInsets.all(16),
        children: [
          _DashboardCard(
            icon: Icons.person_add,
            title: 'Register Client',
            onTap: () => Navigator.push(
              context,
              MaterialPageRoute(builder: (_) => const RegisterClientScreen()),
            ),
          ),
          _DashboardCard(
            icon: Icons.request_page,
            title: 'Apply for Loan',
            onTap: () => Navigator.push(
              context,
              MaterialPageRoute(builder: (_) => const LoanApplicationScreen()),
            ),
          ),
          _DashboardCard(
            icon: Icons.people,
            title: 'My Clients',
            onTap: () {},
          ),
          _DashboardCard(
            icon: Icons.list,
            title: 'My Loans',
            onTap: () {},
          ),
        ],
      ),
    );
  }
}

class _DashboardCard extends StatelessWidget {
  final IconData icon;
  final String title;
  final VoidCallback onTap;

  const _DashboardCard({
    required this.icon,
    required this.title,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return Card(
      child: InkWell(
        onTap: onTap,
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(icon, size: 48, color: Colors.blue),
            const SizedBox(height: 8),
            Text(title, style: const TextStyle(fontSize: 16)),
          ],
        ),
      ),
    );
  }
}
