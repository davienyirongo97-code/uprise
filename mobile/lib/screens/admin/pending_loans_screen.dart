import 'package:flutter/material.dart';
import '../../services/api_service.dart';

class PendingLoansScreen extends StatefulWidget {
  const PendingLoansScreen({super.key});

  @override
  State<PendingLoansScreen> createState() => _PendingLoansScreenState();
}

class _PendingLoansScreenState extends State<PendingLoansScreen> {
  final _apiService = ApiService();
  List<dynamic> _loans = [];
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _loadLoans();
  }

  Future<void> _loadLoans() async {
    try {
      final loans = await _apiService.getPendingLoans();
      setState(() {
        _loans = loans;
        _isLoading = false;
      });
    } catch (e) {
      setState(() => _isLoading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Pending Loans')),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : ListView.builder(
              itemCount: _loans.length,
              itemBuilder: (context, index) {
                final loan = _loans[index];
                return Card(
                  margin: const EdgeInsets.all(8),
                  child: ListTile(
                    title: Text('Loan #${loan['loanNumber']}'),
                    subtitle: Text('Amount: \$${loan['requestedAmount']}'),
                    trailing: Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        IconButton(
                          icon: const Icon(Icons.check, color: Colors.green),
                          onPressed: () => _approveLoan(loan['id']),
                        ),
                        IconButton(
                          icon: const Icon(Icons.close, color: Colors.red),
                          onPressed: () {},
                        ),
                      ],
                    ),
                  ),
                );
              },
            ),
    );
  }

  Future<void> _approveLoan(int loanId) async {
    try {
      await _apiService.approveLoan(loanId, true);
      _loadLoans();
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Failed: $e')),
        );
      }
    }
  }
}
