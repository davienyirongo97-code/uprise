import 'package:flutter/material.dart';
import 'dart:io';
import 'package:image_picker/image_picker.dart';
import '../../services/api_service.dart';

class RegisterClientScreen extends StatefulWidget {
  const RegisterClientScreen({super.key});

  @override
  State<RegisterClientScreen> createState() => _RegisterClientScreenState();
}

class _RegisterClientScreenState extends State<RegisterClientScreen> {
  final _formKey = GlobalKey<FormState>();
  final _apiService = ApiService();
  final _imagePicker = ImagePicker();
  
  int _currentStep = 0;
  bool _isLoading = false;
  
  // Step 1: Scan ID (skip for now)
  
  // Step 2: Personal Information
  final _firstNameController = TextEditingController();
  final _lastNameController = TextEditingController();
  String? _title;
  String? _gender;
  DateTime? _dateOfBirth;
  String? _maritalStatus;
  String? _idType;
  final _nationalIdController = TextEditingController();
  final _phoneController = TextEditingController();
  final _emailController = TextEditingController();
  final _districtController = TextEditingController();
  final _traditionalAuthorityController = TextEditingController();
  final _homeVillageController = TextEditingController();
  final _addressController = TextEditingController();
  
  // Step 3: Employment Details
  final _employerNameController = TextEditingController();
  final _departmentController = TextEditingController();
  final _employmentNumberController = TextEditingController();
  final _monthlySalaryController = TextEditingController();
  String? _fullEmploymentStatus;
  final _lengthOfServiceController = TextEditingController();
  final _workAddressController = TextEditingController();
  
  // Step 4: Bank & Witness Details
  final _bankNameController = TextEditingController();
  final _accountNumberController = TextEditingController();
  String? _accountType;
  final _bankBranchController = TextEditingController();
  final _witnessNameController = TextEditingController();
  final _witnessContactController = TextEditingController();
  final _witnessRelationshipController = TextEditingController();
  final _witnessOccupationController = TextEditingController();
  final _witnessIncomeController = TextEditingController();
  
  // Step 5: ID Capture
  File? _idFrontImage;
  File? _idBackImage;

  @override
  void dispose() {
    _firstNameController.dispose();
    _lastNameController.dispose();
    _nationalIdController.dispose();
    _phoneController.dispose();
    _emailController.dispose();
    _districtController.dispose();
    _traditionalAuthorityController.dispose();
    _homeVillageController.dispose();
    _addressController.dispose();
    _employerNameController.dispose();
    _departmentController.dispose();
    _employmentNumberController.dispose();
    _monthlySalaryController.dispose();
    _lengthOfServiceController.dispose();
    _workAddressController.dispose();
    _bankNameController.dispose();
    _accountNumberController.dispose();
    _bankBranchController.dispose();
    _witnessNameController.dispose();
    _witnessContactController.dispose();
    _witnessRelationshipController.dispose();
    _witnessOccupationController.dispose();
    _witnessIncomeController.dispose();
    super.dispose();
  }


  Future<void> _pickImage(bool isFront) async {
    final ImageSource? source = await showDialog<ImageSource>(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Select Image Source'),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            ListTile(
              leading: const Icon(Icons.camera_alt),
              title: const Text('Camera'),
              onTap: () => Navigator.pop(context, ImageSource.camera),
            ),
            ListTile(
              leading: const Icon(Icons.photo_library),
              title: const Text('Gallery'),
              onTap: () => Navigator.pop(context, ImageSource.gallery),
            ),
          ],
        ),
      ),
    );

    if (source != null) {
      final XFile? image = await _imagePicker.pickImage(source: source);
      if (image != null) {
        setState(() {
          if (isFront) {
            _idFrontImage = File(image.path);
          } else {
            _idBackImage = File(image.path);
          }
        });
      }
    }
  }

  void _nextStep() {
    if (_currentStep < 4) {
      setState(() => _currentStep++);
    }
  }

  void _previousStep() {
    if (_currentStep > 0) {
      setState(() => _currentStep--);
    }
  }


  Future<void> _registerClient() async {
    if (!_formKey.currentState!.validate()) return;
    
    if (_idFrontImage == null || _idBackImage == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Please capture both sides of ID')),
      );
      return;
    }

    setState(() => _isLoading = true);

    try {
      await _apiService.registerClient({
        'fullName': '${_firstNameController.text} ${_lastNameController.text}',
        'nationalId': _nationalIdController.text,
        'phoneNumber': _phoneController.text,
        'email': _emailController.text,
        'address': _addressController.text,
      });

      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Client registered successfully')),
        );
        Navigator.pop(context);
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Failed: $e')),
        );
      }
    } finally {
      setState(() => _isLoading = false);
    }
  }


  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF87CEEB),
      appBar: AppBar(
        title: const Text('Register New Client'),
        backgroundColor: Colors.transparent,
        elevation: 0,
      ),
      body: Column(
        children: [
          // Progress Indicator
          _buildProgressIndicator(),
          
          // Form Content
          Expanded(
            child: Container(
              margin: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(15),
                boxShadow: [
                  BoxShadow(
                    color: Colors.black.withOpacity(0.1),
                    blurRadius: 20,
                    offset: const Offset(0, 5),
                  ),
                ],
              ),
              child: Form(
                key: _formKey,
                child: _buildCurrentStep(),
              ),
            ),
          ),
        ],
      ),
    );
  }


  Widget _buildProgressIndicator() {
    return Container(
      padding: const EdgeInsets.symmetric(vertical: 20, horizontal: 16),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          _buildStepCircle(0, '1', 'Scan ID'),
          _buildStepLine(0),
          _buildStepCircle(1, '2', 'Personal Info'),
          _buildStepLine(1),
          _buildStepCircle(2, '3', 'Employment'),
          _buildStepLine(2),
          _buildStepCircle(3, '4', 'Bank & Witness'),
          _buildStepLine(3),
          _buildStepCircle(4, '5', 'ID Capture'),
        ],
      ),
    );
  }

  Widget _buildStepCircle(int step, String number, String label) {
    final isActive = _currentStep == step;
    final isCompleted = _currentStep > step;
    
    return Column(
      children: [
        Container(
          width: 50,
          height: 50,
          decoration: BoxDecoration(
            shape: BoxShape.circle,
            color: isCompleted
                ? Colors.green
                : isActive
                    ? const Color(0xFF667EEA)
                    : Colors.grey[300],
            border: Border.all(
              color: isCompleted
                  ? Colors.green
                  : isActive
                      ? const Color(0xFF667EEA)
                      : Colors.grey[300]!,
              width: 3,
            ),
          ),
          child: Center(
            child: Text(
              number,
              style: TextStyle(
                color: isCompleted || isActive ? Colors.white : Colors.grey[600],
                fontSize: 18,
                fontWeight: FontWeight.bold,
              ),
            ),
          ),
        ),
        const SizedBox(height: 8),
        Text(
          label,
          style: TextStyle(
            fontSize: 11,
            color: isActive ? const Color(0xFF667EEA) : Colors.grey[600],
            fontWeight: isActive ? FontWeight.bold : FontWeight.normal,
          ),
          textAlign: TextAlign.center,
        ),
      ],
    );
  }

  Widget _buildStepLine(int step) {
    final isCompleted = _currentStep > step;
    return Container(
      width: 40,
      height: 3,
      color: isCompleted ? Colors.green : Colors.grey[300],
      margin: const EdgeInsets.only(bottom: 30),
    );
  }


  Widget _buildCurrentStep() {
    switch (_currentStep) {
      case 0:
        return _buildStep1();
      case 1:
        return _buildStep2();
      case 2:
        return _buildStep3();
      case 3:
        return _buildStep4();
      case 4:
        return _buildStep5();
      default:
        return _buildStep1();
    }
  }

  // Step 1: Scan ID
  Widget _buildStep1() {
    return Column(
      children: [
        Expanded(
          child: Center(
            child: Padding(
              padding: const EdgeInsets.all(40),
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Container(
                    padding: const EdgeInsets.all(30),
                    decoration: BoxDecoration(
                      gradient: const LinearGradient(
                        colors: [Color(0xFF667EEA), Color(0xFF764BA2)],
                      ),
                      borderRadius: BorderRadius.circular(15),
                    ),
                    child: const Icon(
                      Icons.phone_android,
                      size: 80,
                      color: Colors.white,
                    ),
                  ),
                  const SizedBox(height: 30),
                  const Text(
                    'Quick Registration - Scan National ID',
                    style: TextStyle(
                      fontSize: 24,
                      fontWeight: FontWeight.bold,
                      color: Color(0xFF1A3A52),
                    ),
                    textAlign: TextAlign.center,
                  ),
                  const SizedBox(height: 40),
                  ElevatedButton.icon(
                    onPressed: () {
                      // TODO: Implement barcode scanning
                      ScaffoldMessenger.of(context).showSnackBar(
                        const SnackBar(content: Text('Barcode scanning not implemented yet')),
                      );
                    },
                    icon: const Icon(Icons.qr_code_scanner, size: 28),
                    label: const Text('Scan ID Barcode', style: TextStyle(fontSize: 18)),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: const Color(0xFF667EEA),
                      foregroundColor: Colors.white,
                      padding: const EdgeInsets.symmetric(horizontal: 40, vertical: 20),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(10),
                      ),
                    ),
                  ),
                  const SizedBox(height: 30),
                  const Text('OR', style: TextStyle(color: Colors.grey, fontSize: 16)),
                  const SizedBox(height: 20),
                  OutlinedButton(
                    onPressed: _nextStep,
                    style: OutlinedButton.styleFrom(
                      padding: const EdgeInsets.symmetric(horizontal: 40, vertical: 15),
                      side: const BorderSide(color: Colors.grey),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(10),
                      ),
                    ),
                    child: const Text('Skip & Enter Manually', style: TextStyle(fontSize: 16)),
                  ),
                ],
              ),
            ),
          ),
        ),
      ],
    );
  }


  // Step 2: Personal Information
  Widget _buildStep2() {
    return Column(
      children: [
        Expanded(
          child: ListView(
            padding: const EdgeInsets.all(24),
            children: [
              const Icon(Icons.person, size: 60, color: Color(0xFF667EEA)),
              const SizedBox(height: 20),
              const Text(
                'Personal Information',
                style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold, color: Color(0xFF1A3A52)),
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 8),
              const Text(
                'Please provide your personal details',
                style: TextStyle(fontSize: 14, color: Colors.grey),
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 30),
              Row(
                children: [
                  Expanded(
                    child: TextFormField(
                      controller: _firstNameController,
                      decoration: const InputDecoration(
                        labelText: 'First Name *',
                        border: OutlineInputBorder(),
                      ),
                      validator: (v) => v?.isEmpty ?? true ? 'Required' : null,
                    ),
                  ),
                  const SizedBox(width: 16),
                  Expanded(
                    child: TextFormField(
                      controller: _lastNameController,
                      decoration: const InputDecoration(
                        labelText: 'Last Name *',
                        border: OutlineInputBorder(),
                      ),
                      validator: (v) => v?.isEmpty ?? true ? 'Required' : null,
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 16),
              Row(
                children: [
                  Expanded(
                    child: DropdownButtonFormField<String>(
                      value: _title,
                      decoration: const InputDecoration(
                        labelText: 'Title',
                        border: OutlineInputBorder(),
                      ),
                      items: ['Mr', 'Mrs', 'Miss', 'Dr']
                          .map((t) => DropdownMenuItem(value: t, child: Text(t)))
                          .toList(),
                      onChanged: (v) => setState(() => _title = v),
                    ),
                  ),
                  const SizedBox(width: 16),
                  Expanded(
                    child: DropdownButtonFormField<String>(
                      value: _gender,
                      decoration: const InputDecoration(
                        labelText: 'Gender *',
                        border: OutlineInputBorder(),
                      ),
                      items: ['Male', 'Female']
                          .map((g) => DropdownMenuItem(value: g, child: Text(g)))
                          .toList(),
                      onChanged: (v) => setState(() => _gender = v),
                      validator: (v) => v == null ? 'Required' : null,
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 16),
              Row(
                children: [
                  Expanded(
                    child: InkWell(
                      onTap: () async {
                        final date = await showDatePicker(
                          context: context,
                          initialDate: DateTime.now().subtract(const Duration(days: 6570)),
                          firstDate: DateTime(1940),
                          lastDate: DateTime.now(),
                        );
                        if (date != null) setState(() => _dateOfBirth = date);
                      },
                      child: InputDecorator(
                        decoration: const InputDecoration(
                          labelText: 'Date of Birth *',
                          border: OutlineInputBorder(),
                        ),
                        child: Text(
                          _dateOfBirth != null
                              ? '${_dateOfBirth!.day}/${_dateOfBirth!.month}/${_dateOfBirth!.year}'
                              : 'Select date',
                        ),
                      ),
                    ),
                  ),
                  const SizedBox(width: 16),
                  Expanded(
                    child: DropdownButtonFormField<String>(
                      value: _maritalStatus,
                      decoration: const InputDecoration(
                        labelText: 'Marital Status *',
                        border: OutlineInputBorder(),
                      ),
                      items: ['Single', 'Married', 'Divorced', 'Widowed']
                          .map((s) => DropdownMenuItem(value: s, child: Text(s)))
                          .toList(),
                      onChanged: (v) => setState(() => _maritalStatus = v),
                      validator: (v) => v == null ? 'Required' : null,
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 16),
              Row(
                children: [
                  Expanded(
                    child: DropdownButtonFormField<String>(
                      value: _idType,
                      decoration: const InputDecoration(
                        labelText: 'ID Type *',
                        border: OutlineInputBorder(),
                      ),
                      items: ['National ID', 'Passport', "Driver's License"]
                          .map((t) => DropdownMenuItem(value: t, child: Text(t)))
                          .toList(),
                      onChanged: (v) => setState(() => _idType = v),
                      validator: (v) => v == null ? 'Required' : null,
                    ),
                  ),
                  const SizedBox(width: 16),
                  Expanded(
                    child: TextFormField(
                      controller: _nationalIdController,
                      decoration: const InputDecoration(
                        labelText: 'ID Number *',
                        border: OutlineInputBorder(),
                      ),
                      validator: (v) => v?.isEmpty ?? true ? 'Required' : null,
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 16),
              Row(
                children: [
                  Expanded(
                    child: TextFormField(
                      controller: _phoneController,
                      decoration: const InputDecoration(
                        labelText: 'Phone Number *',
                        border: OutlineInputBorder(),
                        hintText: '+265',
                      ),
                      keyboardType: TextInputType.phone,
                      validator: (v) => v?.isEmpty ?? true ? 'Required' : null,
                    ),
                  ),
                  const SizedBox(width: 16),
                  Expanded(
                    child: TextFormField(
                      controller: _emailController,
                      decoration: const InputDecoration(
                        labelText: 'Email',
                        border: OutlineInputBorder(),
                        hintText: 'Optional',
                      ),
                      keyboardType: TextInputType.emailAddress,
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 16),
              Row(
                children: [
                  Expanded(
                    child: TextFormField(
                      controller: _districtController,
                      decoration: const InputDecoration(
                        labelText: 'District *',
                        border: OutlineInputBorder(),
                      ),
                      validator: (v) => v?.isEmpty ?? true ? 'Required' : null,
                    ),
                  ),
                  const SizedBox(width: 16),
                  Expanded(
                    child: TextFormField(
                      controller: _traditionalAuthorityController,
                      decoration: const InputDecoration(
                        labelText: 'T/A (Traditional Authority)',
                        border: OutlineInputBorder(),
                        hintText: 'Optional',
                      ),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 16),
              Row(
                children: [
                  Expanded(
                    child: TextFormField(
                      controller: _homeVillageController,
                      decoration: const InputDecoration(
                        labelText: 'Home Village *',
                        border: OutlineInputBorder(),
                      ),
                      validator: (v) => v?.isEmpty ?? true ? 'Required' : null,
                    ),
                  ),
                  const SizedBox(width: 16),
                  Expanded(
                    child: TextFormField(
                      controller: _addressController,
                      decoration: const InputDecoration(
                        labelText: 'Physical Address',
                        border: OutlineInputBorder(),
                        hintText: 'Optional',
                      ),
                    ),
                  ),
                ],
              ),
            ],
          ),
        ),
        _buildNavigationButtons(),
      ],
    );
  }


  // Step 3: Employment Details
  Widget _buildStep3() {
    return Column(
      children: [
        Expanded(
          child: ListView(
            padding: const EdgeInsets.all(24),
            children: [
              const Icon(Icons.work, size: 60, color: Color(0xFF667EEA)),
              const SizedBox(height: 20),
              const Text(
                'Employment Details',
                style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold, color: Color(0xFF1A3A52)),
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 8),
              const Text(
                'Tell us about your employment',
                style: TextStyle(fontSize: 14, color: Colors.grey),
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 30),
              Row(
                children: [
                  Expanded(
                    child: TextFormField(
                      controller: _employerNameController,
                      decoration: const InputDecoration(
                        labelText: 'Name of Employer/Ministry *',
                        border: OutlineInputBorder(),
                      ),
                      validator: (v) => v?.isEmpty ?? true ? 'Required' : null,
                    ),
                  ),
                  const SizedBox(width: 16),
                  Expanded(
                    child: TextFormField(
                      controller: _departmentController,
                      decoration: const InputDecoration(
                        labelText: 'Department',
                        border: OutlineInputBorder(),
                        hintText: 'Optional',
                      ),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 16),
              Row(
                children: [
                  Expanded(
                    child: TextFormField(
                      controller: _employmentNumberController,
                      decoration: const InputDecoration(
                        labelText: 'Employment Number',
                        border: OutlineInputBorder(),
                        hintText: 'Optional',
                      ),
                    ),
                  ),
                  const SizedBox(width: 16),
                  Expanded(
                    child: TextFormField(
                      controller: _monthlySalaryController,
                      decoration: const InputDecoration(
                        labelText: 'Net Monthly Salary (MK) *',
                        border: OutlineInputBorder(),
                      ),
                      keyboardType: TextInputType.number,
                      validator: (v) => v?.isEmpty ?? true ? 'Required' : null,
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 16),
              Row(
                children: [
                  Expanded(
                    child: DropdownButtonFormField<String>(
                      value: _fullEmploymentStatus,
                      decoration: const InputDecoration(
                        labelText: 'Full Employment Status *',
                        border: OutlineInputBorder(),
                      ),
                      items: ['Yes - Permanent', 'No - Contract/Temporary']
                          .map((s) => DropdownMenuItem(value: s, child: Text(s)))
                          .toList(),
                      onChanged: (v) => setState(() => _fullEmploymentStatus = v),
                      validator: (v) => v == null ? 'Required' : null,
                    ),
                  ),
                  const SizedBox(width: 16),
                  Expanded(
                    child: TextFormField(
                      controller: _lengthOfServiceController,
                      decoration: const InputDecoration(
                        labelText: 'Length of Service',
                        border: OutlineInputBorder(),
                        hintText: 'e.g., 5 years',
                      ),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 16),
              TextFormField(
                controller: _workAddressController,
                decoration: const InputDecoration(
                  labelText: 'Work Address',
                  border: OutlineInputBorder(),
                ),
              ),
            ],
          ),
        ),
        _buildNavigationButtons(),
      ],
    );
  }


  // Step 4: Bank & Witness Details
  Widget _buildStep4() {
    return Column(
      children: [
        Expanded(
          child: ListView(
            padding: const EdgeInsets.all(24),
            children: [
              const Icon(Icons.account_balance, size: 60, color: Color(0xFF667EEA)),
              const SizedBox(height: 20),
              const Text(
                'Bank & Witness Details',
                style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold, color: Color(0xFF1A3A52)),
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 8),
              const Text(
                'Provide your bank and witness information',
                style: TextStyle(fontSize: 14, color: Colors.grey),
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 30),
              const Text(
                'Bank Details',
                style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: Color(0xFF667EEA)),
              ),
              const Divider(),
              const SizedBox(height: 16),
              Row(
                children: [
                  Expanded(
                    child: TextFormField(
                      controller: _bankNameController,
                      decoration: const InputDecoration(
                        labelText: 'Bank Name *',
                        border: OutlineInputBorder(),
                      ),
                      validator: (v) => v?.isEmpty ?? true ? 'Required' : null,
                    ),
                  ),
                  const SizedBox(width: 16),
                  Expanded(
                    child: TextFormField(
                      controller: _accountNumberController,
                      decoration: const InputDecoration(
                        labelText: 'Account Number *',
                        border: OutlineInputBorder(),
                      ),
                      validator: (v) => v?.isEmpty ?? true ? 'Required' : null,
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 16),
              Row(
                children: [
                  Expanded(
                    child: DropdownButtonFormField<String>(
                      value: _accountType,
                      decoration: const InputDecoration(
                        labelText: 'Account Type *',
                        border: OutlineInputBorder(),
                      ),
                      items: ['Savings', 'Current']
                          .map((t) => DropdownMenuItem(value: t, child: Text(t)))
                          .toList(),
                      onChanged: (v) => setState(() => _accountType = v),
                      validator: (v) => v == null ? 'Required' : null,
                    ),
                  ),
                  const SizedBox(width: 16),
                  Expanded(
                    child: TextFormField(
                      controller: _bankBranchController,
                      decoration: const InputDecoration(
                        labelText: 'Branch',
                        border: OutlineInputBorder(),
                      ),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 30),
              const Text(
                'Witness/Guarantor Details',
                style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: Color(0xFF667EEA)),
              ),
              const Divider(),
              const SizedBox(height: 16),
              Row(
                children: [
                  Expanded(
                    child: TextFormField(
                      controller: _witnessNameController,
                      decoration: const InputDecoration(
                        labelText: 'Witness Name *',
                        border: OutlineInputBorder(),
                      ),
                      validator: (v) => v?.isEmpty ?? true ? 'Required' : null,
                    ),
                  ),
                  const SizedBox(width: 16),
                  Expanded(
                    child: TextFormField(
                      controller: _witnessContactController,
                      decoration: const InputDecoration(
                        labelText: 'Witness Contact *',
                        border: OutlineInputBorder(),
                        hintText: '+265',
                      ),
                      keyboardType: TextInputType.phone,
                      validator: (v) => v?.isEmpty ?? true ? 'Required' : null,
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 16),
              Row(
                children: [
                  Expanded(
                    child: TextFormField(
                      controller: _witnessRelationshipController,
                      decoration: const InputDecoration(
                        labelText: 'Relationship to Client *',
                        border: OutlineInputBorder(),
                        hintText: 'e.g., Brother, Friend',
                      ),
                      validator: (v) => v?.isEmpty ?? true ? 'Required' : null,
                    ),
                  ),
                  const SizedBox(width: 16),
                  Expanded(
                    child: TextFormField(
                      controller: _witnessOccupationController,
                      decoration: const InputDecoration(
                        labelText: 'Witness Occupation',
                        border: OutlineInputBorder(),
                      ),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 16),
              TextFormField(
                controller: _witnessIncomeController,
                decoration: const InputDecoration(
                  labelText: 'Witness Monthly Income (MK)',
                  border: OutlineInputBorder(),
                ),
                keyboardType: TextInputType.number,
              ),
            ],
          ),
        ),
        _buildNavigationButtons(),
      ],
    );
  }


  // Step 5: ID Document Capture
  Widget _buildStep5() {
    return Column(
      children: [
        Expanded(
          child: ListView(
            padding: const EdgeInsets.all(24),
            children: [
              const Icon(Icons.camera_alt, size: 60, color: Color(0xFF667EEA)),
              const SizedBox(height: 20),
              const Text(
                'ID Document Capture',
                style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold, color: Color(0xFF1A3A52)),
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 8),
              const Text(
                'Capture or upload both sides of your ID',
                style: TextStyle(fontSize: 14, color: Colors.grey),
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 30),
              Row(
                children: [
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Text(
                          'ID Front Side *',
                          style: TextStyle(fontSize: 16, fontWeight: FontWeight.w500),
                        ),
                        const SizedBox(height: 8),
                        _buildImageCapture(true),
                      ],
                    ),
                  ),
                  const SizedBox(width: 16),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Text(
                          'ID Back Side *',
                          style: TextStyle(fontSize: 16, fontWeight: FontWeight.w500),
                        ),
                        const SizedBox(height: 8),
                        _buildImageCapture(false),
                      ],
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 20),
              Container(
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: Colors.yellow[50],
                  border: Border.all(color: Colors.orange),
                  borderRadius: BorderRadius.circular(8),
                ),
                child: const Row(
                  children: [
                    Icon(Icons.info_outline, color: Colors.orange),
                    SizedBox(width: 12),
                    Expanded(
                      child: Text(
                        'Both ID front and back images are required',
                        style: TextStyle(color: Colors.orange),
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
        _buildNavigationButtons(isLastStep: true),
      ],
    );
  }

  Widget _buildImageCapture(bool isFront) {
    final image = isFront ? _idFrontImage : _idBackImage;
    
    return GestureDetector(
      onTap: () => _pickImage(isFront),
      child: Container(
        height: 200,
        decoration: BoxDecoration(
          border: Border.all(color: Colors.grey[300]!, width: 2, style: BorderStyle.solid),
          borderRadius: BorderRadius.circular(8),
          color: Colors.grey[50],
        ),
        child: image != null
            ? Stack(
                children: [
                  ClipRRect(
                    borderRadius: BorderRadius.circular(6),
                    child: Image.file(
                      image,
                      width: double.infinity,
                      height: double.infinity,
                      fit: BoxFit.cover,
                    ),
                  ),
                  Positioned(
                    top: 8,
                    right: 8,
                    child: IconButton(
                      icon: const Icon(Icons.close, color: Colors.white),
                      style: IconButton.styleFrom(
                        backgroundColor: Colors.red,
                      ),
                      onPressed: () {
                        setState(() {
                          if (isFront) {
                            _idFrontImage = null;
                          } else {
                            _idBackImage = null;
                          }
                        });
                      },
                    ),
                  ),
                ],
              )
            : Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  const Icon(Icons.camera_alt, size: 48, color: Colors.grey),
                  const SizedBox(height: 12),
                  Text(
                    isFront ? 'Capture ID Front' : 'Capture ID Back',
                    style: const TextStyle(fontWeight: FontWeight.w500),
                  ),
                  const SizedBox(height: 16),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      ElevatedButton.icon(
                        onPressed: () => _pickImage(isFront),
                        icon: const Icon(Icons.camera_alt, size: 18),
                        label: const Text('Camera'),
                        style: ElevatedButton.styleFrom(
                          backgroundColor: const Color(0xFF667EEA),
                          foregroundColor: Colors.white,
                        ),
                      ),
                      const SizedBox(width: 8),
                      ElevatedButton.icon(
                        onPressed: () => _pickImage(isFront),
                        icon: const Icon(Icons.upload_file, size: 18),
                        label: const Text('Upload'),
                        style: ElevatedButton.styleFrom(
                          backgroundColor: Colors.green,
                          foregroundColor: Colors.white,
                        ),
                      ),
                    ],
                  ),
                ],
              ),
      ),
    );
  }


  Widget _buildNavigationButtons({bool isLastStep = false}) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.05),
            blurRadius: 10,
            offset: const Offset(0, -5),
          ),
        ],
      ),
      child: Row(
        children: [
          if (_currentStep > 0)
            Expanded(
              child: OutlinedButton(
                onPressed: _previousStep,
                style: OutlinedButton.styleFrom(
                  padding: const EdgeInsets.symmetric(vertical: 16),
                  side: const BorderSide(color: Colors.grey),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(8),
                  ),
                ),
                child: const Text('← Previous', style: TextStyle(fontSize: 16)),
              ),
            ),
          if (_currentStep > 0) const SizedBox(width: 16),
          Expanded(
            child: ElevatedButton(
              onPressed: isLastStep
                  ? (_isLoading ? null : _registerClient)
                  : _nextStep,
              style: ElevatedButton.styleFrom(
                backgroundColor: isLastStep ? Colors.green : const Color(0xFF667EEA),
                foregroundColor: Colors.white,
                padding: const EdgeInsets.symmetric(vertical: 16),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(8),
                ),
              ),
              child: _isLoading
                  ? const SizedBox(
                      height: 20,
                      width: 20,
                      child: CircularProgressIndicator(
                        color: Colors.white,
                        strokeWidth: 2,
                      ),
                    )
                  : Text(
                      isLastStep ? '✓ Register Client' : 'Next →',
                      style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                    ),
            ),
          ),
        ],
      ),
    );
  }
}
